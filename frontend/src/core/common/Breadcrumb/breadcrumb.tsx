import React from "react";
import { Link } from "react-router";
import { all_routes } from "../../../feature-module/routes/all_routes";
import ImageWithBasePath from "../../imageWithBasePath";

interface BreadcrumbPath {
    label: string;
    link?: string;
    active?: boolean;
}

interface BreadcrumbProps {
    title: string;
    paths: BreadcrumbPath[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ title, paths }) => {
    return (
        <div className="breadcrumb-bar">
            <ImageWithBasePath
                src="assets/img/bg/breadcrumb-bg-01.png"
                alt="image"
                className="breadcrumb-bg-01 d-none d-lg-block"
            />
            <ImageWithBasePath
                src="assets/img/bg/breadcrumb-bg-02.png"
                alt="image"
                className="breadcrumb-bg-02 d-none d-lg-block"
            />
            <ImageWithBasePath
                src="assets/img/bg/breadcrumb-bg-03.png"
                alt="image"
                className="breadcrumb-bg-03"
            />
            <div className="row align-items-center text-center position-relative z-1">
                <div className="col-md-12 col-12 breadcrumb-arrow">
                    <h1 className="breadcrumb-title">{title}</h1>
                    <nav aria-label="breadcrumb" className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to={all_routes.index}>
                                    <span>
                                        <i className="material-icons-outlined me-1">home</i>
                                    </span>
                                    Inicio
                                </Link>
                            </li>
                            {paths.map((item, index) => (
                                <li
                                    key={index}
                                    className={`breadcrumb-item ${item.active ? "active" : ""}`}
                                    aria-current={item.active ? "page" : undefined}
                                >
                                    {item.link ? (
                                        <Link to={item.link}>{item.label}</Link>
                                    ) : (
                                        item.label
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Breadcrumb;
