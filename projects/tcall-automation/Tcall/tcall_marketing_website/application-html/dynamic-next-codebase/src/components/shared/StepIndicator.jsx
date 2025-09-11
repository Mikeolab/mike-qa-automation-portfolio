import React from "react";

import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const StepIndicator = ({ currentStep, agentId, isInbound, prompts_title }) => {
  const { user } = useAuthStore();

  let steps;
  steps = !agentId
    ? [
        {
          number: 1,
          label: "Agent type",
          path: "/admin/agents/super-agent-add",
        },
        {
          number: 2,
          label: "Voice agent",
          path:
            agentId && isInbound
              ? `/admin/agents/add-agent-voice?agentId=${agentId}&is_inbound=${isInbound}`
              : "/admin/agents/add-agent-voice",
        },
        {
          number: 3,
          label: "Language",
          path:
            agentId && isInbound && prompts_title
              ? `/admin/agents/add-agent-language?agentId=${agentId}&is_inbound=${isInbound}&prompts_title=${prompts_title}`
              : "/admin/agents/add-agent-language",
        },
        {
          number: 4,
          label: "Prompt",
          path:
            agentId && isInbound && prompts_title
              ? `/admin/agents/add-agent-prompt?agentId=${agentId}&is_inbound=${isInbound}&prompts_title=${prompts_title}`
              : "/admin/agents/add-agent-prompt",
        },
      ]
    : [
        // { number: 1, label: "Agent type", path: "/admin/agents/super-agent-add" },
        {
          number: 1, //2
          label: "Voice agent",
          path:
            agentId && isInbound
              ? `/admin/agents/add-agent-voice?agentId=${agentId}&is_inbound=${isInbound}`
              : "/admin/agents/add-agent-voice",
        },
        {
          number: 2, //3
          label: "Language",
          path:
            agentId && isInbound && prompts_title
              ? `/admin/agents/add-agent-language?agentId=${agentId}&is_inbound=${isInbound}&prompts_title=${prompts_title}`
              : "/admin/agents/add-agent-language",
        },
        {
          number: 3, //4
          label: "Prompt",
          path:
            agentId && isInbound && prompts_title
              ? `/admin/agents/add-agent-prompt?agentId=${agentId}&is_inbound=${isInbound}&prompts_title=${prompts_title}`
              : "/admin/agents/add-agent-prompt",
        },
      ];
  const customerSteps = [
    {
      number: 1,
      label: "Language",
      path: `/customer/agents/add-agent-language?agentId=${agentId}&is_inbound=${isInbound}&prompts_title=${prompts_title}`,
    },
    {
      number: 2,
      label: "Prompt",
      path: `/customer/agents/add-agent-prompt?agentId=${agentId}&is_inbound=${isInbound}&prompts_title=${prompts_title}`,
    },
  ];

  return (
    <ul className="agent-wrapper__topindicator">
      {user?.role === "Admin" &&
        steps.map((step) => (
          <li
            key={step.number}
            className={currentStep === step.number ? "active" : ""}
          >
            <Link to={step.path}>
              <span>{step.number}</span>
              {step.label}
            </Link>
          </li>
        ))}
      {user?.role !== "Admin" &&
        customerSteps.map((step) => (
          <li
            key={step.number}
            className={currentStep === step.number ? "active" : ""}
          >
            <Link to={step.path}>
              <span>{step.number}</span>
              {step.label}
            </Link>
          </li>
        ))}
    </ul>
  );
};

export default StepIndicator;
