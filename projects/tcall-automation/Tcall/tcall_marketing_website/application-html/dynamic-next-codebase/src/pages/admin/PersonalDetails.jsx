import React, { useEffect, useMemo } from "react";
import { useState } from "react";

import { Link } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import startsWith from "lodash.startswith";
import { useQueryClient } from "@tanstack/react-query";
import userImage from "../../assets/images/user-image.png"; // Import the image as specified
import { useClientDetailsQuery } from "../../hooks/api/useGetClientDetailsQuery";
import { editProfileSchema } from "../../lib/validationSchema";
import FieldErrorMessage from "../../components/shared/FieldErrorMessage";
import { useEditProfileMutation } from "../../hooks/api/useEditProfileMutation";
import useAuthStore from "../../store/authStore";
import UserIcon from "../../assets/images/user.png";

import "react-phone-input-2/lib/style.css";

const PersonalDetails = () => {
  const { data, isLoading } = useClientDetailsQuery({
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });
  const queryClient = useQueryClient(); // Access queryClient

  const authStore = useAuthStore();
  const { user, setUser } = authStore;
  // console.log({ data });
  const {
    first_name,
    last_name,
    email,
    mobile_no,
    client_id,
    profile_image,
    country_code,
  } = data
    ? data.data
    : {
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        client_id: "",
        mobile_no: "",
        profile_image: "",
        country_code: "",
      };

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
    },
  });

  const [mode, setMode] = useState("view");

  // Add state for separate phone fields
  const [phoneState, setPhoneState] = useState({
    country_code: "",
    mobile_no: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file); // Save the uploaded file for submission
      setPreviewImage(URL.createObjectURL(file)); // Generate a preview URL
    }
  };

  // Add this handler
  const handlePhoneChange = (value, data) => {
    // Update the combined phone field for Zod validation
    setValue("phone", value);

    // Update the separate country code and mobile number
    setPhoneState({
      country_code: `+${data.dialCode}`,
      mobile_no: value.slice(data.dialCode.length),
    });
  };

  const validatePhoneNumber = (inputNumber, country, countries) => {
    // Check if the number starts with any valid country code
    const isValidCountryCode = countries.some((c) => {
      return (
        startsWith(inputNumber, c.dialCode) ||
        startsWith(c.dialCode, inputNumber)
      );
    });

    // Add any additional validation rules you need
    const hasValidLength = inputNumber.length >= country.dialCode.length + 6;
    const isNumeric = /^\d+$/.test(inputNumber);

    return isValidCountryCode && hasValidLength && isNumeric;
  };

  const ediProfileMutation = useEditProfileMutation({
    onSuccess: (updatedData) => {
      // Update the user context
      setUser({ ...user, ...updatedData.data });

      // Update the cached query data
      queryClient.setQueryData(["clientDetails"], (oldData) => {
        if (!oldData) return null;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            ...updatedData.data, // Merge updated fields
          },
        };
      });

      reset(updatedData.data); // Reset form with updated data
      setMode("view"); // Switch back to view mode
    },
  });

  const onSubmitForm = async (formData) => {
    const payload = {
      ...formData,
      ...phoneState,
    };

    // Include image in the payload if uploaded
    if (uploadedImage) {
      const formDataPayload = new FormData();
      formDataPayload.append("profile_image", uploadedImage);
      Object.keys(payload).forEach((key) => {
        formDataPayload.append(key, payload[key]);
      });

      ediProfileMutation.mutate(formDataPayload);
    } else {
      ediProfileMutation.mutate(payload);
    }
  };

  // Dynamically update form default values when data is fetched
  const defaultValues = useMemo(() => {
    if (!data?.data) return {};
    setPreviewImage(data.data.profile_image);
    console.log(data.data);

    setUser({ ...user, profile_image: data.data.profile_image });
    setPhoneState({
      country_code: data?.data?.country_code,
      mobile_no: data?.data?.mobile_no,
    });
    return {
      first_name: data.data.first_name || "",
      last_name: data.data.last_name || "",
      phone: `${data.data.country_code}${data.data.mobile_no}` || "",
      profile_image: data.data.profile_image,
    };
  }, [data]);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="o-dasboard__rightbar o-dasboard__rightbar--doctordash">
      <div className="o-dasboard__rightheading">
        <h2 className="o-dasboard__title">Personal details</h2>
      </div>
      <div className="o-dasboard__rightbody flex-body flex-div-start">
        <div className="o-dasboard__personal-details">
          <div className="o-dasboard__dflink o-dasboard__dflink--personal">
            <div className="o-dasboard__ditems">
              <div className="o-dasboard__ditemstop">
                <div className="user-image relative">
                  <img
                    src={previewImage ? previewImage : UserIcon}
                    alt="user image"
                    className="w-full h-full object-cover rounded-full"
                  />
                  {mode === "edit" && (
                    <>
                      {/* Hidden input field */}
                      <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                        onChange={handleImageUpload} // Function to handle file input
                      />
                      {/* SVG trigger */}
                      <span
                        className="absolute bottom-0 right-0 z-10 font-bold p-1 bg-[#261049] rounded-full cursor-pointer"
                        onClick={() =>
                          document.getElementById("fileInput")?.click()
                        }
                      >
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 19 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.8348 2.26414C13.0331 2.06584 13.2685 1.90854 13.5276 1.80123C13.7867 1.69391 14.0644 1.63867 14.3448 1.63867C14.6253 1.63867 14.903 1.69391 15.1621 1.80123C15.4211 1.90854 15.6566 2.06584 15.8549 2.26414C16.0532 2.46244 16.2105 2.69785 16.3178 2.95694C16.4251 3.21602 16.4803 3.49371 16.4803 3.77415C16.4803 4.05458 16.4251 4.33227 16.3178 4.59136C16.2105 4.85045 16.0532 5.08586 15.8549 5.28416L5.66229 15.4767L1.50977 16.6092L2.64227 12.4567L12.8348 2.26414Z"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </>
                  )}
                </div>
                <div className="deails-area">
                  <ul className="details-info">
                    <li className="one p-2">
                      <label>First name</label>
                      {mode === "edit" ? (
                        <>
                          <input
                            type="text"
                            {...register("first_name")}
                            placeholder="Enter First Name"
                            className="o-login__input"
                          />
                          {errors.first_name && (
                            <FieldErrorMessage
                              message={errors.first_name.message}
                            />
                          )}
                        </>
                      ) : (
                        <p>{first_name}</p>
                      )}
                    </li>
                    <li className="one p-2">
                      <label>Last name</label>
                      {mode === "edit" ? (
                        <>
                          <input
                            type="text"
                            {...register("last_name")}
                            placeholder="Enter First Name"
                            className="o-login__input"
                          />
                          {errors.last_name && (
                            <FieldErrorMessage
                              message={errors.last_name.message}
                            />
                          )}
                        </>
                      ) : (
                        <p>{last_name}</p>
                      )}
                    </li>
                    <li className="one p-2">
                      <label>Client ID</label>
                      <p>{client_id}</p>
                    </li>
                    <li className="third p-2">
                      <label>Email</label>
                      <p>{email}</p>
                    </li>
                    <li className="one p-2">
                      <label>Mobile No.</label>
                      {mode === "edit" ? (
                        <>
                          <PhoneInput
                            country={"us"} // default country
                            value={control._formValues.phone}
                            onChange={handlePhoneChange}
                            inputClass="o-general-dashboard__forminput"
                            containerClass="phone-input-container"
                            isValid={validatePhoneNumber}
                          />
                          {errors.phone && (
                            <FieldErrorMessage message={errors.phone.message} />
                          )}
                        </>
                      ) : (
                        <p>
                          <span>{country_code}</span>
                          <span>{mobile_no ? mobile_no : "N/A"}</span>
                        </p>
                      )}
                    </li>
                  </ul>

                  {mode === "edit" ? (
                    <>
                      <p
                        onClick={handleSubmit(onSubmitForm)}
                        className="reset-btn flex gap-2 mr-2 cursor-pointer"
                      >
                        {/* <img src={editIcon} alt="Edit Icon" /> */}
                        Save
                      </p>
                      <p
                        onClick={() => setMode("view")}
                        className="reset-btn flex gap-2 mr-2 cursor-pointer"
                      >
                        {/* <img src={editIcon} alt="Edit Icon" /> */}
                        Cancel
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        onClick={() => setMode("edit")}
                        className="reset-btn flex gap-2 mr-2 cursor-pointer"
                      >
                        {/* <img src={editIcon} alt="Edit Icon" /> */}
                        Edit Profile
                      </p>
                      <Link
                        to={`/${
                          user?.role === "Admin" ? "admin" : "customer"
                        }/dashboard/change-password`}
                        className="reset-btn"
                      >
                        Reset Password
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PersonalDetails);
