"""
Prediction Engine — Forecasting, scoring y detección de anomalías.

Módulos:
  - Lead scoring (probabilidad de cierre)
  - Forecasting de conversión
  - Detección de anomalías en métricas
  - Estimación de tiempo de cierre

Usa datos históricos de temporal_memory + datos actuales del CRM.
Los modelos son heurísticos + LLM para análisis complejo.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

from memory.semantic import get_metric_history, record_metric
from tools.crm_client import crm_client

logger = logging.getLogger(__name__)


@dataclass
class PredictionResult:
    """Resultado de una predicción."""

    prediction_type: str
    value: float
    confidence: float  # 0-1
    factors: list[dict[str, Any]] = field(default_factory=list)
    explanation: str = ""
    metadata: dict[str, Any] = field(default_factory=dict)


class PredictionEngine:
    """Motor de predicciones y análisis predictivo."""

    async def score_lead(self, client_data: dict[str, Any]) -> PredictionResult:
        """
        Calcula score de un lead basado en heurísticas.

        Factores:
          - Datos de contacto completos (+20)
          - Notas registradas (+15)
          - Frescura del lead (+10 si <24h)
          - Etapa en pipeline (+5 a +25)
          - Fuente del lead (+5 a +15)
          - Interacciones registradas (+10)

        Returns:
            PredictionResult con score 0-100
        """
        score = 30  # Base
        factors = []

        # Datos de contacto
        has_email = bool(client_data.get("email"))
        has_phone = bool(client_data.get("telefono"))
        if has_email and has_phone:
            score += 20
            factors.append({"factor": "contacto_completo", "impact": 20, "detail": "Email y teléfono"})
        elif has_email or has_phone:
            score += 10
            factors.append({"factor": "contacto_parcial", "impact": 10})
        else:
            score -= 15
            factors.append({"factor": "sin_contacto", "impact": -15, "detail": "No contactable"})

        # Notas
        notas = client_data.get("notas", "")
        if notas and len(notas) > 20:
            score += 15
            factors.append({"factor": "notas_detalladas", "impact": 15})
        elif notas:
            score += 5
            factors.append({"factor": "notas_breves", "impact": 5})

        # Frescura
        created = client_data.get("createdAt")
        if created:
            try:
                created_dt = datetime.fromisoformat(str(created).replace("Z", "+00:00"))
                hours = (datetime.now(timezone.utc) - created_dt).total_seconds() / 3600
                if hours < 24:
                    score += 10
                    factors.append({"factor": "lead_fresco", "impact": 10, "detail": f"{hours:.0f}h"})
                elif hours > 168:  # >7 días
                    score -= 10
                    factors.append({"factor": "lead_viejo", "impact": -10, "detail": f"{hours/24:.0f} días"})
            except (ValueError, TypeError):
                pass

        # Etapa pipeline
        stage = (client_data.get("metadata", {}).get("estado", "") or "lead").lower()
        stage_scores = {
            "lead": 0,
            "contactado": 10,
            "calificado": 20,
            "propuesta": 25,
            "negociacion": 25,
        }
        stage_bonus = stage_scores.get(stage, 0)
        if stage_bonus:
            score += stage_bonus
            factors.append({"factor": "etapa_pipeline", "impact": stage_bonus, "detail": stage})

        # Fidelizado
        if client_data.get("fidelizado"):
            score += 10
            factors.append({"factor": "cliente_fidelizado", "impact": 10})

        # Clamp 0-100
        score = max(0, min(100, score))

        # Confidence basada en cantidad de datos disponibles
        data_completeness = sum([
            bool(has_email), bool(has_phone), bool(notas),
            bool(created), bool(stage != "lead"),
        ]) / 5
        confidence = 0.4 + (data_completeness * 0.5)

        return PredictionResult(
            prediction_type="lead_score",
            value=score,
            confidence=round(confidence, 2),
            factors=factors,
            explanation=self._explain_lead_score(score, factors),
        )

    async def forecast_conversion(
        self,
        *,
        days_ahead: int = 30,
    ) -> PredictionResult:
        """
        Forecast simplificado de conversión basado en tendencia histórica.
        """
        # Obtener historial de conversión
        try:
            history = await get_metric_history("conversion_rate", days=90, limit=12)
        except Exception:
            history = []

        if len(history) < 2:
            return PredictionResult(
                prediction_type="conversion_forecast",
                value=0,
                confidence=0.1,
                explanation="Datos insuficientes para generar forecast",
            )

        values = [h["value"] for h in history]
        avg = sum(values) / len(values)
        recent_avg = sum(values[:3]) / min(3, len(values))

        # Trend simple: comparar promedio reciente vs histórico
        if avg > 0:
            trend = (recent_avg - avg) / avg
        else:
            trend = 0

        # Proyectar
        projected = recent_avg * (1 + trend * (days_ahead / 30))
        projected = max(0, min(100, projected))

        confidence = min(0.8, 0.3 + len(history) * 0.05)

        return PredictionResult(
            prediction_type="conversion_forecast",
            value=round(projected, 2),
            confidence=round(confidence, 2),
            factors=[
                {"factor": "historical_avg", "value": round(avg, 2)},
                {"factor": "recent_avg", "value": round(recent_avg, 2)},
                {"factor": "trend", "value": round(trend * 100, 1), "unit": "%"},
            ],
            explanation=(
                f"Basado en {len(history)} datos históricos. "
                f"Promedio histórico: {avg:.1f}%, reciente: {recent_avg:.1f}%. "
                f"Tendencia: {'al alza' if trend > 0.05 else 'a la baja' if trend < -0.05 else 'estable'} "
                f"({trend*100:+.1f}%)."
            ),
            metadata={"days_ahead": days_ahead, "data_points": len(history)},
        )

    async def detect_anomalies(
        self,
        metric: str,
        current_value: float,
        *,
        threshold_std: float = 2.0,
    ) -> PredictionResult:
        """
        Detecta si un valor actual es anómalo comparado con historial.
        Usa método simple de desviación estándar.
        """
        try:
            history = await get_metric_history(metric, days=60, limit=30)
        except Exception:
            history = []

        if len(history) < 5:
            return PredictionResult(
                prediction_type="anomaly_detection",
                value=0,
                confidence=0.1,
                explanation="Datos insuficientes para detección de anomalías",
            )

        values = [h["value"] for h in history]
        mean = sum(values) / len(values)
        variance = sum((v - mean) ** 2 for v in values) / len(values)
        std = variance ** 0.5

        if std == 0:
            is_anomaly = current_value != mean
            z_score = float("inf") if is_anomaly else 0
        else:
            z_score = abs(current_value - mean) / std
            is_anomaly = z_score > threshold_std

        return PredictionResult(
            prediction_type="anomaly_detection",
            value=1.0 if is_anomaly else 0.0,
            confidence=min(0.9, 0.3 + len(history) * 0.02),
            factors=[
                {"factor": "current_value", "value": current_value},
                {"factor": "mean", "value": round(mean, 2)},
                {"factor": "std_dev", "value": round(std, 2)},
                {"factor": "z_score", "value": round(z_score, 2)},
            ],
            explanation=(
                f"{'ANOMALÍA detectada' if is_anomaly else 'Valor normal'}. "
                f"Valor actual: {current_value}, media: {mean:.2f}, "
                f"desviación: {std:.2f}, z-score: {z_score:.2f} "
                f"(umbral: {threshold_std})"
            ),
            metadata={"metric": metric, "is_anomaly": is_anomaly},
        )

    def _explain_lead_score(self, score: int, factors: list[dict]) -> str:
        """Genera explicación legible del score de un lead."""
        if score >= 80:
            level = "Lead de alto valor"
        elif score >= 60:
            level = "Lead con potencial"
        elif score >= 40:
            level = "Lead estándar"
        else:
            level = "Lead de bajo potencial"

        top_factors = sorted(factors, key=lambda f: abs(f.get("impact", 0)), reverse=True)[:3]
        factor_strs = [f"{f['factor']} ({f['impact']:+d})" for f in top_factors]

        return f"{level} (score {score}/100). Factores principales: {', '.join(factor_strs)}"


# Singleton
prediction_engine = PredictionEngine()
