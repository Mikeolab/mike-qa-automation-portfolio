import React from "react";

import ClientBusinessRowItem from "./ClientBusinessRowItem";
import ClientBusinessRowItemSkeleton from "./ClientBusinessRowItemSkeleton";

const EmptyState = () => (
  <div className="flex justify-center items-center min-h-[100px] text-lg text-white bg-transparent rounded mt-4">
    No Data Found
  </div>
);

export default function ClientBusinessList({
  businessList,
  isLoading,
  isError,
}) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="mt-4">
          {[1, 2, 3].map((index) => (
            <ClientBusinessRowItemSkeleton key={index} />
          ))}
        </div>
      );
    }
    if (isError) {
      return <EmptyState />;
    }
    if (!businessList?.length) {
      return <EmptyState />;
    }
    return (
      <div className="overflow-y-auto max-h-[350px]">
        {businessList.map((business, index) => (
          <ClientBusinessRowItem
            key={business.id || index}
            business={business}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="o-agentlist__tablewrapper">
      <ul className="o-agentlist__tabble o-agentlist__tabble--header">
        <li>Requested by</li>
        <li>Business Name</li>
        <li>Phone Number</li>
        <li>Email</li>
        <li>Business domain</li>
        <li>Request</li>
      </ul>
      {renderContent()}
    </div>
  );
}
