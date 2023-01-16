import cx from "classnames";
const Placeholder = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => <span className={cx("text-muted", className)}>{children}</span>;

export default Placeholder;
