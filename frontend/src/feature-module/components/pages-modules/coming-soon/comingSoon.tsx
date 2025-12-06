import { Link } from "react-router";
import { all_routes } from "../../../routes/all_routes";
import { useEffect, useState } from "react";

const ComingSoon = () => {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [seconds]);

  const formatTime = (time: number) => {
    // Add leading zero for single-digit numbers
    return time < 10 ? `0${time}` : time;
  };
  return (
    <>
      {/* Start Content */}
      <div className="container-fuild">
        <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100 coming-soon-cover">
          {/* start row */}
          <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap">
            <div className="col-lg-10 mx-auto">
              <div className="coming-soon-item">
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <div>
                    <h1>Coming Soon</h1>
                    <div className="row align-items-center">
                      <div className="col-md-7 mx-auto px-4">
                        <ul className="d-flex list-unstyled align-items-center justify-content-center mb-3">
                          <li className="me-sm-3 me-2">
                            <div className="timer-cover">
                              <h6 className="days fw-bold mb-0">54</h6>
                            </div>
                            <p className="text-center mb-0">Days</p>
                          </li>
                          <li className="me-sm-3 mb-2 me-2">:</li>
                          <li className="me-sm-3 me-2">
                            <div className="timer-cover">
                              <h6 className="hours mb-0">02</h6>
                            </div>
                            <p className="text-center mb-0">Hours</p>
                          </li>
                          <li className="me-sm-3 mb-2 me-2">:</li>
                          <li className="me-sm-3 me-2">
                            <div className="timer-cover">
                              <h6 className="minutes mb-0">54</h6>
                            </div>
                            <p className="text-center mb-0">Minutes</p>
                          </li>
                          <li className="me-sm-3 mb-2 me-2">:</li>
                          <li>
                            <div className="timer-cover">
                              <h6 className="seconds mb-0">
                                {formatTime(seconds)}
                              </h6>
                            </div>
                            <p className="text-center mb-0">Seconds</p>
                          </li>
                        </ul>
                        <div className="mb-3">
                          <div className="mb-3">
                            <p className="d-flex text-center justify-content-center">
                              Our website is under constructions currently.
                              Don't worry! We will coming within a short time.
                              Stay with us{" "}
                            </p>
                          </div>
                          <div className="subscribe-form">
                            <input
                              type="email"
                              className="form-control me-2"
                              placeholder="Enter  Your Email"
                            />
                            <Link to="#" className="btn btn-secondary">
                              Submit
                            </Link>
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-center">
                          <Link to={all_routes.index} className="btn btn-dark">
                            Back to Home
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
        </div>
      </div>
      {/* End Content */}
    </>
  );
};

export default ComingSoon;
