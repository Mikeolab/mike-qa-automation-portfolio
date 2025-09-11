import netProfitImage from "../../assets/images/net-profit-image.svg"; // Import the image as specified
import { useGetAdminStatisticsDetailsQuery } from "../../hooks/api/useGetAdminStatusDetailsQuery";
import { getAdminStatisticsDetailsQueryAPI } from "../../services/admin/getAdminStatisticsDetailsQueryAPI";

const PersonalStatus = () => {
  const { data, isLoading, isPending, isError } =
    useGetAdminStatisticsDetailsQuery();

  if (isPending) {
    return (
      <div className="o-dasboard__rightbar o-dasboard__rightbar--doctordash">
        <div className="o-dasboard__rightheading">
          <h2 className="o-dasboard__title">Loading...</h2>
        </div>
      </div>
    );
  }
  const { plans_detail, call_details } = data?.data;
  console.log({
    data,
    isLoading,
    isPending,
    isError,
    plans_detail,
    call_details,
  });

  return (
    <div className="o-dasboard__rightbar o-dasboard__rightbar--doctordash">
      <div className="o-dasboard__rightheading">
        <h2 className="o-dasboard__title">Statistics Information</h2>
      </div>
      <div className="o-dasboard__rightbody flex-body flex-div-start">
        <div className="o-dasboard__personalstatus">
          {/* Net Profit Section */}
          <div className="o-dasboard__netprofit">
            <div className="part">
              <img src={netProfitImage} alt="Net Profit image" />
              <h2>Total net profit</h2>
            </div>
            <div className="part">
              <p>
                {plans_detail?.total_revenue
                  ? `$${Number(
                      plans_detail?.total_revenue +
                        call_details?.total_platform_cost
                    )?.toFixed(2)}`
                  : "N/A"}{" "}
              </p>
            </div>
          </div>

          {/* Call Revenue Section */}
          <div className="o-dasboard__callrecived">
            <div className="o-dasboard__callrevenue">
              <span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 2V8H22"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23 1L16 8"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 16.9201V19.9201C22.0011 20.1986 21.9441 20.4743 21.8325 20.7294C21.7209 20.9846 21.5573 21.2137 21.3521 21.402C21.1468 21.5902 20.9046 21.7336 20.6407 21.8228C20.3769 21.912 20.0974 21.9452 19.82 21.9201C16.7428 21.5857 13.787 20.5342 11.19 18.8501C8.77382 17.3148 6.72533 15.2663 5.18999 12.8501C3.49997 10.2413 2.44824 7.27109 2.11999 4.1801C2.095 3.90356 2.12787 3.62486 2.21649 3.36172C2.30512 3.09859 2.44756 2.85679 2.63476 2.65172C2.82196 2.44665 3.0498 2.28281 3.30379 2.17062C3.55777 2.05843 3.83233 2.00036 4.10999 2.0001H7.10999C7.5953 1.99532 8.06579 2.16718 8.43376 2.48363C8.80173 2.80008 9.04207 3.23954 9.10999 3.7201C9.23662 4.68016 9.47144 5.62282 9.80999 6.5301C9.94454 6.88802 9.97366 7.27701 9.8939 7.65098C9.81415 8.02494 9.62886 8.36821 9.35999 8.6401L8.08999 9.9101C9.51355 12.4136 11.5864 14.4865 14.09 15.9101L15.36 14.6401C15.6319 14.3712 15.9751 14.1859 16.3491 14.1062C16.7231 14.0264 17.1121 14.0556 17.47 14.1901C18.3773 14.5286 19.3199 14.7635 20.28 14.8901C20.7658 14.9586 21.2094 15.2033 21.5265 15.5776C21.8437 15.9519 22.0122 16.4297 22 16.9201Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="part">
                <p>Total Calls Revenue</p>
                <span>$ {call_details?.total_cost}</span>
              </div>
            </div>
            <div className="o-dasboard__callsummery">
              <div className="show">
                <span>Total calls</span>
                <p>{call_details?.total_calls}</p>
              </div>
              <div className="show">
                <span>Total Minutes</span>
                <p>{call_details?.total_minutes} min</p>
              </div>
              <div className="show">
                <span>Total Platform charges</span>
                <p>$ {call_details?.total_platform_cost}</p>
              </div>
            </div>
            <div className="o-dasboard__callsummery">
              <div className="show">
                <span>Total Twilio cost</span>
                <p>$ {call_details?.total_twilio_cost}</p>
              </div>
              <div className="show">
                <span>Total Retell charges</span>
                <p>$ {call_details?.total_retell_cost}</p>
              </div>
            </div>
          </div>

          {/* Total Revenue Plan Section */}
          <div className="o-dasboard__totalrevenueplan">
            <span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div className="o-dasboard__revenueplanpart">
              <div className="heading">
                <p>
                  Total Plan Revenue:
                  <span>
                    $
                    {plans_detail?.total_revenue
                      ? `${plans_detail?.total_revenue}`
                      : "N/A"}
                  </span>
                </p>
              </div>
              <ul className="o-dasboard__totalrevenueplanul">
                {plans_detail?.plans &&
                  plans_detail?.plans?.map((plan) => {
                    return (
                      <li>
                        <div className="plan-name">{plan?.plan_title}</div>
                        <div className="total-sell">
                          <p>
                            Total Sells{" "}
                            <span>
                              {plan?.plan_sell ? `$${plan?.plan_sell}` : "N/A"}
                            </span>
                          </p>
                          <p>
                            Total Revenue{" "}
                            <span>
                              {plan?.plan_revenue
                                ? `$${plan?.plan_revenue}`
                                : "N/A"}
                            </span>
                          </p>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalStatus;
