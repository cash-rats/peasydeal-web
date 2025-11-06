import { type RouteConfig, route, layout, index } from "@react-router/dev/routes";

// Manually configure routes with parent-child relationships to avoid collisions
export default [
  // Homepage layout with index
  layout("routes/__index.tsx", [
    index("routes/__index/index.tsx"),
  ]),

  // Cart layout with index
  layout("routes/cart.tsx", [
    index("routes/cart/index.tsx"),
  ]),

  // Checkout layout with index
  layout("routes/checkout.tsx", [
    index("routes/checkout/index.tsx"),
  ]),

  // Blog layout with index and child routes
  layout("routes/blog.tsx", [
    index("routes/blog/index.tsx"),
    route("page/:page", "routes/blog/page/$page.tsx"),
    route("post/:blog", "routes/blog/post/$blog.tsx"),
  ]),

  // Confirm subscription (standalone route, no children)
  route("confirm-subscription", "routes/confirm-subscription.tsx"),

  // Payment layout with dynamic child route
  layout("routes/payment.tsx", [
    route(":orderId", "routes/payment/$orderId.tsx"),
  ]),

  // Standalone routes
  route("subscribe", "routes/subscribe/index.tsx"),
  route("tracking", "routes/tracking/index.tsx"),
  route("unsubscribe", "routes/unsubscribe/index.tsx"),
] satisfies RouteConfig;
