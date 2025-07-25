type StarProps = {
  isActive: boolean;
  filled: "yes" | "no" | "half";
  isMobile: boolean;
  endOfQuiz?: boolean
};

export default function Star({ isActive, filled, isMobile, endOfQuiz=false }: StarProps) {
  const color = isActive? "#63aeff" : "#FFC107";
  const size = endOfQuiz && isMobile? "28px" : endOfQuiz? "30px" : isMobile ? "16px" : "19px";
  const viewBox = "0 -850 800 800";
  if (isActive){
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={size}
        viewBox={viewBox}
        width={size}
        fill={color}
      >
        <path d="m280.31-197.08 75.77-245.61L158.31-604h243.31L480-842.76 558.38-604h243.31L603.92-442.69l75.77 245.61L480-348.62 280.31-197.08Z" />
      </svg>
    );
  }
  if (filled === "yes") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={size}
        viewBox={viewBox}
        width={size}
        fill={color}
      >
        <path d="m280.31-197.08 75.77-245.61L158.31-604h243.31L480-842.76 558.38-604h243.31L603.92-442.69l75.77 245.61L480-348.62 280.31-197.08Z" />
      </svg>
    );
  } else if (filled === "half") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={size}
        viewBox={viewBox}
        width={size}
        fill={color}
      >
        <path d="M480-678v263l102 78-38-124 114-91H521l-41-126ZM280.31-197.08l75.77-245.61L158.31-604h243.31L480-842.76 558.38-604h243.31L603.92-442.69l75.77 245.61L480-348.62 280.31-197.08Z" />
      </svg>
    );
  } else {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={size}
        viewBox={viewBox}
        width={size}
        fill={color}
      >
        <path d="m378-337 102-78 102 78-38-124 114-91H521l-41-126-40 126H302l115 91-39 124Zm-97.69 139.92 75.77-245.61L158.31-604h243.31L480-842.76 558.38-604h243.31L603.92-442.69l75.77 245.61L480-348.62 280.31-197.08ZM480-508Z" />
      </svg>
    );
  }
}