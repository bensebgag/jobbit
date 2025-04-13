interface Props {
    children?: React.ReactNode
    styleElement?: string;
}

export  default function Container( {children,styleElement}:Props ) {
   return(
  <div className={`max-w-[1400px] mx-auto ${styleElement}`}>
       {children}
   </div>
       )

}