import { useEffect, useState } from "react";

import { getAuthToken } from "@/apis/cookie";

export const useAuth = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = getAuthToken();

    setIsAuthorized(!!token);
  }, []);

  return { isAuthorized };
};
