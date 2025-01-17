const AppsIcon = ({ dark }: { dark: boolean }) => (
  <svg
    width="56"
    height="32"
    viewBox="0 0 56 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 12C0 5.37258 5.37258 0 12 0H44C50.6274 0 56 5.37258 56 12C56 18.6274 50.6274 24 44 24H12C5.37258 24 0 18.6274 0 12Z"
      fill={dark ? "#004A74" : "#C3E7FF"}
    />
    <path
      d="M20 6C20 4.89543 20.8954 4 22 4H25C26.1046 4 27 4.89543 27 6V9C27 10.1046 26.1046 11 25 11H22C20.8954 11 20 10.1046 20 9V6Z"
      fill={dark ? "#A8C8FB" : "#004A74"}
    />
    <path
      d="M20 15C20 13.8954 20.8954 13 22 13H25C26.1046 13 27 13.8954 27 15V18C27 19.1046 26.1046 20 25 20H22C20.8954 20 20 19.1046 20 18V15Z"
      fill={dark ? "#A8C8FB" : "#004A74"}
    />
    <path
      d="M29 6C29 4.89543 29.8954 4 31 4H34C35.1046 4 36 4.89543 36 6V9C36 10.1046 35.1046 11 34 11H31C29.8954 11 29 10.1046 29 9V6Z"
      fill={dark ? "#A8C8FB" : "#004A74"}
    />
    <path
      d="M29 15C29 13.8954 29.8954 13 31 13H34C35.1046 13 36 13.8954 36 15V18C36 19.1046 35.1046 20 34 20H31C29.8954 20 29 19.1046 29 18V15Z"
      fill={dark ? "#A8C8FB" : "#004A74"}
    />
  </svg>
);

export default AppsIcon;
