// Import other pages...

import AddAgents from "./pages/admin/agent/AddAgent";
import AddAgentsLanguage from "./pages/admin/agent/AddAgentLanguage";
import AddCustomerAgentsLanguage from "./pages/customer/agents/AddAgentLanguage";
import AddCustomerAgentsVoice from "./pages/customer/agents/AddAgentVoice";
import AddAgentsVoice from "./pages/admin/agent/AddAgentVoice";
import AddPromptAgent from "./pages/admin/agent/AddPromptAgent";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import AdminUsersList from "./pages/admin/AdminUsersList";
import AgentsDashboard from "./pages/admin/AgentDashboard";
import PersonalDetails from "./pages/admin/PersonalDetails";
import PersonalStatus from "./pages/admin/PersonalStatus";
import PurchaseNumbers from "./pages/admin/PurchaseNumber";
import PurchasedPhoneNumbers from "./pages/admin/PurchasePhoneNumber";
import ResetPassword from "./pages/admin/ResetPassword";
import AddBusinessPage from "./pages/customer/AddBusinessPage";
import ApprovalPendingPage from "./pages/customer/ApprovalPendingPage";
import ForgotPasswordPage from "./pages/customer/auth/ForgotPasswordPage";
import { LoginPage } from "./pages/customer/auth/LoginPage";
import RegistrationPage from "./pages/customer/auth/RegistrationPage";
import ResetPasswordPage from "./pages/customer/auth/ResetPasswordPage";
import { VerifyOTPPage } from "./pages/customer/auth/VerifyOTPPage";
import BusinessDetailsPage from "./pages/customer/BusinessDetailsPage";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import NotFoundPage from "./pages/NotFoundPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import MyCallsDashboard from "./pages/admin/call/CallDashboard";
import AgentInboundList from "./pages/admin/agent/AgentInboundList";
import AgentOutboundList from "./pages/admin/agent/AgentOutboundList";
import AdminBusinessApproval from "./pages/admin/AdminBusinessApproval";
import ContactDetails from "./pages/customer/ContactDetails";
import AddBalance from "./pages/customer/AddBalance";
import ApprocalPlan from "./pages/customer/ApprocalPlan";
import CustomerAgentsDashboard from "./pages/customer/agents/dashboard";
import CallDashboard from "./pages/customer/call/CallDashbaord";
import CallTranscript from "./pages/customer/call/CallTranscript";
import ChangePassword from "./pages/customer/ChangePassword";
import StripeFormPage from "./pages/customer/StripeFormPage";
import PaymentSuccessPage from "./pages/customer/PaymentSuccessPage";
import CallAudioTranscript from "./pages/admin/call/CallAudioTranscript";
import MyCallList from "./pages/admin/call/CallList";
import AddNewBalance from "./pages/customer/AddNewBalance";

export const publicRoutes = [
  {
    path: "/login",
    element: LoginPage,
  },
  {
    path: "/register",
    element: RegistrationPage,
  },
  {
    path: "/forgot-password",
    element: ForgotPasswordPage,
  },
  {
    path: "/verify-otp",
    element: VerifyOTPPage,
  },
  {
    path: "/reset-password",
    element: ResetPasswordPage,
  },
  {
    path: "/unauthorized",
    element: UnauthorizedPage,
  },
  // Add other public routes...
];

export const customerRoutes = [
  {
    path: "/customer/dashboard",
    element: CustomerDashboard,
  },
  {
    path: "/customer/dashboard/add-business",
    element: AddBusinessPage,
  },
  {
    path: "/customer/dashboard/approval-pending",
    element: ApprovalPendingPage,
  },
  {
    path: "/customer/dashboard/business-details",
    element: BusinessDetailsPage,
  },

  {
    path: "/customer/call",
    element: CallDashboard,
  },
  {
    path: "/customer/agents",
    element: CustomerAgentsDashboard,
  },
  {
    path: "/customer/agents/add-agent-language",
    element: AddAgentsLanguage,
  },
  {
    path: "/customer/agents/add-agent-prompt",
    element: AddPromptAgent,
  },
  {
    path: "/customer/dashbaord/contact-details",
    element: PersonalDetails,
  },
  {
    path: "/customer/dashboard/add-balance",
    element: AddBalance,
  },
  {
    path: "/customer/dashboard/add-new-balance",
    element: AddNewBalance,
  },
  {
    path: "/customer/dashboard/pricing-plan",
    element: ApprocalPlan,
  },
  {
    path: "/customer/dashboard/checkout-plan",
    element: StripeFormPage,
  },
  {
    path: "/customer/dashboard/payment-success",
    element: PaymentSuccessPage,
  },
  // {
  //   path: "/customer/agents/add-agent-language",
  //   element: AddCustomerAgentsLanguage,
  // },
  {
    path: "/customer/dashboard/add-agent-voice",
    element: AddCustomerAgentsVoice,
  },
  {
    path: "/customer/agents/call-transcript",
    element: CallTranscript,
  },
  {
    path: "/customer/call/call-details/audio-transcript",
    element: CallAudioTranscript,
  },
  {
    path: "/customer/dashboard/change-password",
    element: ChangePassword,
  },
  {
    path: "/customer/dashboard/profile",
    element: PersonalDetails,
  },
  // Add other customer routes...
];

export const adminRoutes = [
  {
    path: "/admin/dashboard",
    element: AdminDashboard,
  },
  {
    path: "/admin/dashboard-user-list",
    element: AdminUsersList,
  },
  {
    path: "/admin/business-approval/:businessId",
    element: AdminBusinessApproval,
  },
  {
    path: "/admin/dashboard-personal-details",
    element: PersonalDetails,
  },
  {
    path: "/admin/dashboard/profile",
    element: PersonalDetails,
  },
  {
    path: "/admin/dashboard/change-password",
    element: ResetPassword,
  },
  {
    path: "/admin/dashboard-personal-status",
    element: PersonalStatus,
  },
  {
    path: "/admin/dashboard/dashboard-purchase-number",
    element: PurchaseNumbers,
  },
  {
    path: "/admin/dashboard/dashboard-purchase-phone-number",
    element: PurchasedPhoneNumbers,
  },
  {
    path: "/admin/agents",
    element: AgentsDashboard,
  },
  {
    path: "/admin/agents/super-agent-add",
    element: AddAgents,
  },
  {
    path: "/admin/agents/add-agent-prompt",
    element: AddPromptAgent,
  },
  {
    path: "/admin/agents/add-agent-voice",
    element: AddAgentsVoice,
  },
  {
    path: "/admin/agents/add-agent-language",
    element: AddAgentsLanguage,
  },
  {
    path: "/admin/agent-inbound-list",
    element: AgentInboundList,
  },
  {
    path: "/admin/agent-outbound-list",
    element: AgentOutboundList,
  },

  {
    path: "/admin/call",
    element: MyCallList,
  },
  {
    path: "/admin/call/call-details",
    element: MyCallsDashboard,
  },
  {
    path: "/admin/call/call-details/audio-transcript",
    element: CallAudioTranscript,
  },

  // Add other admin routes...
];

// Add this new export for the 404 route
export const notFoundRoute = {
  path: "*",
  element: NotFoundPage,
};
