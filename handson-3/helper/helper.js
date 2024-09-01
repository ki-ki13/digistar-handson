const filterSensitiveInfo = (user) => {
  const { password, ...filteredUser } = user;
  return filteredUser;
};



module.exports = {
  filterSensitiveInfo,
};
