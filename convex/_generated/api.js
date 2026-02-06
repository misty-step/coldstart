export const api = {
  functions: {
    users: {
      getByClerkId: "functions/users:getByClerkId",
      updateSubscription: "functions/users:updateSubscription",
    },
  },
};

export const internal = {
  functions: {
    users: {
      createInternal: "functions/users:createInternal",
      updateInternal: "functions/users:updateInternal",
      removeInternal: "functions/users:removeInternal",
      updateStripeCustomerIdInternal:
        "functions/users:updateStripeCustomerIdInternal",
    },
  },
};
