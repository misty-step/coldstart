 
/**
 * Generated Convex API - Stub for development
 * Run `npx convex dev` to generate actual implementation
 */

// Function reference builder - Convex SDK pattern
function functionRef(path) {
  return path;
}

export const api = {
  functions: {
    users: {
      getByClerkId: functionRef("functions/users:getByClerkId"),
      getById: functionRef("functions/users:getById"),
      create: functionRef("functions/users:create"),
      update: functionRef("functions/users:update"),
      updateStripeCustomerId: functionRef("functions/users:updateStripeCustomerId"),
      updateSubscription: functionRef("functions/users:updateSubscription"),
      remove: functionRef("functions/users:remove"),
    },
  },
};

export const internal = {
  functions: {
    users: {
      createInternal: functionRef("functions/users:createInternal"),
      updateInternal: functionRef("functions/users:updateInternal"),
      removeInternal: functionRef("functions/users:removeInternal"),
    },
  },
};
