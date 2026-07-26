import cn from "@/common/libs/clsxm";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  [propName: string]: React.ReactNode | string | undefined;
}

const Container = ({ children, className = "", ...others }: ContainerProps) => {
  return (
    <div
      className={cn(
        "mt-[4.5rem] px-4 py-6 sm:px-6 sm:py-8 lg:mt-0 lg:p-8",
        className,
      )}
      {...others}
    >
      {children}
    </div>
  );
};

export default Container;
