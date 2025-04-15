
export const formatInr = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatFollowers = (count: number) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};
