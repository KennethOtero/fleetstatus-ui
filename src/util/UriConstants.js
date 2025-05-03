// Base endpoint
const BASE_URL                             = "http://localhost:8080";

// Aircraft endpoints
export const URI_AIRCRAFT                  = BASE_URL + "/v1/aircraft";
export const URI_CARRIER                   = BASE_URL + "/v1/carrier";
export const URI_TYPE                      = BASE_URL + "/v1/type";

// Event endpoints
export const URI_EVENTS                    = BASE_URL + "/v1/events";
export const URI_OOS_EVENTS                = BASE_URL + "/v1/OutOfServiceEvents";
export const URI_EVENT_HISTORY             = BASE_URL + "/v1/EventHistory";
export const URI_SHOW_BACK_IN_SERVICE      = BASE_URL + "/v1/showBackInService";
export const URI_REASON                    = BASE_URL + "/v1/reason";
export const URI_CSV                       = BASE_URL + "/v1/csv";
export const URI_DOWNTIME_REPORT           = BASE_URL + "/v1/DownTimeReport";

// User endpoints
export const URI_AUTH_STATUS               = BASE_URL + "/v1/auth/status";
export const URI_LOGIN                     = BASE_URL + "/login";
export const URI_LOGIN_PAGE                = "/login";
export const URI_LOGOUT                    = BASE_URL + "/logout";

// History endpoints
export const URI_CALENDER_EVENT_HISTORY    = BASE_URL + "/v1/CalenderEventHistory";