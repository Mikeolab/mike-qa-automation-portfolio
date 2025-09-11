import * as z from "zod";

export const loginSchema = z.object({
  username_or_email: z.string().min(1, "Username or email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Update the validation schema
export const registrationSchema = z
  .object({
    business_type: z.string().min(1, "Business type is required"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .refine((value) => {
        // Basic validation - you can customize this based on your needs
        return value.length >= 10 && /^\d+$/.test(value);
      }, "Please enter a valid phone number"),
    // country_code: z
    //   .string()
    //   .min(1, "Country code is required")
    //   .regex(/^\+\d{1,4}$/, "Invalid country code format"),
    // phone_number: z
    //   .string()
    //   .min(1, "Phone number is required")
    //   .regex(/^\d{10}$/, "Phone number must be 10 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
    terms_accepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms and Conditions",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const otpSchema = z.object({
  otp: z.string().length(6, "Please enter a valid 6-digit OTP"),
});

export const resetPasswordSchema = z
  .object({
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_new_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords don't match",
    path: ["confirm_new_password"],
  });

  export const changePasswordSchema = z
  .object({
    old_password: z.string().min(8, "Password must be at least 8 characters"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_new_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords don't match",
    path: ["confirm_new_password"],
  });

export const addBusinessSchema = z.object({
  business_type: z.string().min(1, "Business type is required"),
  name: z.string().min(1, "Business name is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine((value) => {
      // Basic validation - you can customize this based on your needs
      return value.length >= 10 && /^\d+$/.test(value);
    }, "Please enter a valid phone number"),
  // country_code: z
  //   .string()
  //   .min(1, "Country code is required")
  //   .regex(/^\+\d{1,4}$/, "Invalid country code format"),
  // phone_number: z
  //   .string()
  //   .min(1, "Phone number is required")
  //   .regex(/^\d{10}$/, "Phone number must be 10 digits"),
  address: z.string().min(1, "Address is required"),
  address2: z.string().optional(), // Optional field
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  description: z.string().min(1, "Business description is required"),
});

export const editProfileSchema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    // .refine((value) => {
    //   // Basic validation - you can customize this based on your needs
    //   return value.length >= 10 && /^\d+$/.test(value);
    // }, "Please enter a valid phone number"),
  // country_code: z
  //   .string()
  //   .min(1, "Country code is required")
  //   .regex(/^\+\d{1,4}$/, "Invalid country code format"),
  // phone_number: z
  //   .string()
  //   .min(1, "Phone number is required")
  //   .regex(/^\d{10}$/, "Phone number must be 10 digits"),
});