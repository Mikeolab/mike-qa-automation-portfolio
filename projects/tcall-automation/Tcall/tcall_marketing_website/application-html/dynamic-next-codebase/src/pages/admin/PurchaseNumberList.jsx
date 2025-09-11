import React from "react";
import PhoneInput from "react-phone-input-2";
import PurchaseNumberItem from "./PurchaseNumberItem";

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-16 bg-gray-200 rounded-md mb-4"></div>
    <div className="h-16 bg-gray-200 rounded-md mb-4"></div>
    <div className="h-16 bg-gray-200 rounded-md"></div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-8">
    <p className="text-gray-500 text-lg">No records found</p>
  </div>
);

const PurchaseNumberList = ({ response, isPending, isError, searchParams }) => {
  return (
    <div className="o-dasboard__listitems">
      <ul className="list-title">
        <li>Number</li>
        <li>Region</li>
        <li>Action</li>
      </ul>
      {/* Content */}
      {isPending ? (
        <LoadingSkeleton />
      ) : response?.count <= 0 || isError ? (
        <EmptyState />
      ) : (
        <div className="">
          {response?.data?.map((phone, index) => (
            <PurchaseNumberItem
              data={phone}
              key={index}
              searchParams={searchParams}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseNumberList;
