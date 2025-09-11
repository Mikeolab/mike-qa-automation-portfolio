import React, { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules"; // Import Autoplay module
import "swiper/css";
import "swiper/css/autoplay";
import { useNavigate } from "react-router-dom";
import customerSupportBackImage from "../../assets/images/cusomer-support-back.svg";
import { usePlanDetailsQuery } from "../../hooks/api/useGetPlanDetailsQuery";
import ApprocalPlanModal from "./ApprocalPlanModal";
import { useClientDetailsQuery } from "../../hooks/api/useGetClientDetailsQuery";

const ApprocalPlan = () => {
  const navigate = useNavigate();
  const { data, isPending, refetch } = usePlanDetailsQuery();

  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { data: clientDetails, refetch: refetchClientDetails } =
    useClientDetailsQuery();

  useEffect(() => {
    console.log({ clientDetails });
    if (clientDetails?.data?.is_active_plan) {
      navigate("/customer/dashboard");
    }
  }, [clientDetails]);

  useEffect(() => {
    // Add immediate refetch when component mounts
    refetch();
  }, []);

  const plan = [
    {
      id: "basic",
      title: "Basic PLAN",
      price: "$10/M",
      description: "Our most popular plan",
      features: [
        "Lorem ipsum popular abra",
        "Lorem ipsum popular abra",
        "Lorem ipsum popular abra",
      ],
    },
    {
      id: "basic",
      title: "Basic PLAN",
      price: "$10/M",
      description: "Our most popular plan",
      features: [
        "Lorem ipsum popular abra",
        "Lorem ipsum popular abra",
        "Lorem ipsum popular abra",
      ],
    },
    {
      id: "business",
      title: "Business PLAN",
      price: "$20/M",
      description: "Our most popular plan",
      features: [
        "Lorem ipsum popular abra",
        "Lorem ipsum popular abra",
        "Lorem ipsum popular abra",
      ],
    },
    {
      id: "enterprise",
      title: "ENTERPRISE PLAN",
      price: "$40/M",
      description: "Our most popular plan",
      features: [
        "Lorem ipsum popular abra",
        "Lorem ipsum popular abra",
        "Lorem ipsum popular abra",
      ],
    },
  ];

  const handleBuyPlan = async (plan) => {
    console.log({ plan });
    setIsModalOpen(true);
    setSelectedPlan(plan);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  useEffect(() => {
    console.log(data?.data);
    if (Array.isArray(data?.data)) {
      const newPlans = data?.data?.map((plan) => {
        return {
          id: plan?.id,
          title: plan?.title,
          price: plan?.price,
          description: "",
          type:
            plan?.title === "Basic Plan"
              ? "basic"
              : plan?.title === "Enterprise Plan"
              ? "enterprice"
              : plan?.title === "Business Plan"
              ? "business"
              : "",
          features: plan?.description?.split(";"),
        };
      });
      setPlans(newPlans);
    } else {
      console.warn("data?.data is not an array. Defaulting to empty plans.");
      setPlans([]);
    }
  }, [data, isPending]);

  // Skeleton component
  const SkeletonPlan = () => (
    <li className="o-general-dashboard__planitem splide__slide">
      <h3 className="o-general-dashboard__itemtitle skeleton skeleton-title"></h3>
      <span className="o-general-dashboard__itemprice skeleton skeleton-price"></span>
      <p className="o-general-dashboard__itemplan skeleton skeleton-description"></p>
      <ul className="o-general-dashboard__itemul">
        {Array.from({ length: data?.count }).map((_, index) => (
          <li
            key={index}
            className="o-general-dashboard__itemli skeleton skeleton-feature"
          ></li>
        ))}
      </ul>
      <div className="o-general-dashboard__planbtn o-login__btnarea">
        <span>
          <div className="skeleton skeleton-button"></div>
        </span>
      </div>
    </li>
  );

  return (
    <div className="o-dasboard__rightbar o-general-dashboard">
      <div className="o-dasboard__rightbody flex-body flex-div-ends">
        <img
          src={customerSupportBackImage}
          alt="Customer Support backend"
          className="o-dasboard__pointimage"
        />
        <div className="o-general-dashboard__plan">
          <h6 className="o-general-dashboard__plantitle">
            You do not have any active plan selected!
          </h6>
          <p className="o-general-dashboard__subplantitle">
            Select any plan to proceed
          </p>
          <div className="o-general-dashboard__planwrap">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={10}
              slidesPerView={3}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true, // Stops autoplay when the user hovers over the Swiper
              }}
              breakpoints={{
                320: {
                  slidesPerView: 1, // 1 slide on small screens
                  spaceBetween: 10,
                },
                640: {
                  slidesPerView: 2, // 2 slides on medium screens
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 3, // 3 slides on larger screens
                  spaceBetween: 10,
                },
              }}
            >
              {isPending
                ? Array.from({ length: 3 }).map((_, index) => (
                    <SwiperSlide key={index}>
                      <SkeletonPlan />
                    </SwiperSlide>
                  ))
                : plans?.map((plan) => (
                    <SwiperSlide key={plan?.id}>
                      <li
                        className={`o-general-dashboard__planitem ${
                          plan?.type === "business"
                            ? "o-general-dashboard__planitempopular"
                            : ""
                        } o-general-dashboard__planitem--${plan?.type}`}
                      >
                        <h3 className="o-general-dashboard__itemtitle">
                          {plan?.title}
                        </h3>
                        <span className="o-general-dashboard__itemprice">
                          {`$${plan?.price}/M`}
                        </span>
                        <p className="o-general-dashboard__itemplan">
                          {plan?.description}
                        </p>
                        <ul className="o-general-dashboard__itemul">
                          {plan?.features?.map((feature, index) => (
                            <li
                              key={index}
                              className="o-general-dashboard__itemli"
                            >
                              <svg
                                width="15"
                                height="16"
                                viewBox="0 0 15 16"
                                fill="none"
                              >
                                <g clipPath="url(#clip0_28_77630)">
                                  <path
                                    d="M13.7125 7.5354V8.08601C13.7118 9.37661 13.2939 10.6324 12.5211 11.6661C11.7484 12.6998 10.6622 13.456 9.42454 13.8219C8.18691 14.1878 6.86413 14.1439 5.65351 13.6966C4.44288 13.2494 3.40927 12.4227 2.70682 11.3401C2.00438 10.2574 1.67073 8.97661 1.75565 7.6888C1.84057 6.40099 2.3395 5.17514 3.17803 4.19405C4.01656 3.21297 5.14977 2.52923 6.40864 2.24481C7.66751 1.96038 8.9846 2.09051 10.1635 2.61579"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M13.7125 3.29883L7.72761 9.28974L5.93213 7.49426"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_28_77630">
                                    <rect
                                      width="14.3638"
                                      height="14.3638"
                                      fill="white"
                                      transform="translate(0.545898 0.90625)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="o-general-dashboard__planbtn o-login__btnarea">
                          <span>
                            <button
                              type="submit"
                              value="buy now"
                              className="o-login__button"
                              onClick={() => handleBuyPlan(plan)}
                            >
                              buy now
                            </button>
                          </span>
                        </div>
                      </li>
                    </SwiperSlide>
                  ))}
            </Swiper>
          </div>
        </div>
      </div>
      <ApprocalPlanModal
        closeModal={closeModal}
        selectedPlan={selectedPlan}
        isModalOpen={isModalOpen}
      />
    </div>
  );
};

export default ApprocalPlan;
