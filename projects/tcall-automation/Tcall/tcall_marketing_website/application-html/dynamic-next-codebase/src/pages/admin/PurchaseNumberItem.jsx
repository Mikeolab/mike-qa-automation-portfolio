import { toast } from "sonner";
import { usePurchasePhoneNumberMutaion } from "../../hooks/api/usePurchasePhoneNumberMutation";
import { useQueryClient } from "@tanstack/react-query";
import PhoneInput from "react-phone-input-2";

const PurchaseNumberItem = ({ data, searchParams }) => {
  const queryClient = useQueryClient();
  const updatePurchaseNumberMutation = usePurchasePhoneNumberMutaion({
    onSuccess: () => {
      toast.success("Phone number purchased successfully");

      queryClient.invalidateQueries({
        queryKey: ["purchasePhoneNumber", searchParams],
      });

      // if (type === "new") {
      //   navigate("/admin/super-agent-add");
      // }
    },
    onError: (error) => {
      console.log({ error });
      // Check for HTTP status codes and provide user feedback
      if (error.response) {
        const statusCode = error.response.data.statusCode;
        if (statusCode === 400) {
          toast.error(error.response.data.message);
        } else if (statusCode === 500) {
          toast.error(error.response.data.message);
        } else {
          toast.error(
            `An unexpected error occurred: ${
              error.response.data?.message || "Error"
            }`
          );
        }
      } else {
        toast.error("Network error. Please check your internet connection.");
      }
    },
  });
  const handlePurchase = async (data) => {
    console.log({ purchasedata: data });
    updatePurchaseNumberMutation.mutate({
      iso_country: data.iso_country,
      phone_number: data.phone_number,
    });
  };

  return (
    <>
      <ul className="list-iems list-iems--number">
        <li>
          <PhoneInput
            value={data?.phone_number}
            disabled
            inputStyle={{
              border: "none",
              outline: "none",
              background: "transparent",
              pointerEvents: "none",
              padding: "0",
              margin: "0",
              marginLeft: "25px", // Add space for the flag
            }}
            containerStyle={{
              display: "inline-block",
              position: "relative", // Ensure proper positioning
            }}
            buttonStyle={{
              border: "none",
              background: "transparent",
              padding: 0,
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)", // Center vertically
              pointerEvents: "none", // Make flag non-clickable
              cursor: "default",
            }}
            dropdownStyle={{ display: "none" }} // Hide dropdown completely
            enableAreaCodes={false}
            disableCountryCode={true}
            formatOnInit={false}
            disableDropdown={true} // Disable dropdown functionality
          />
        </li>
        <li>
          <span>Region</span>
          <span>{data?.region ? data?.region : "N/A"}</span>
        </li>
        <li>
          <p
            data-target="modaledit"
            className="btn js-open-modal cursor-pointer"
            onClick={() => handlePurchase(data)}
          >
            PURCHASE
          </p>
        </li>
      </ul>
    </>
  );
};

export default PurchaseNumberItem;
