export const formatTotal = (total) => {
    if (!total) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(total);
  };