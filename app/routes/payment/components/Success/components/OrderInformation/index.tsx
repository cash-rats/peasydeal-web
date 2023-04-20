function Content({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col mt-4 gap-1 font-poppins">
      {children}
    </div>
  )
}

interface OrderInformationProps {
  email: string;
  phone: string;
  firstname: string;
  lastname: string
  address: string;
  address2: string;
  city: string;
  postal: string;
  country: string;
}

function OrderInformation({
  email,
  phone,
  firstname,
  lastname,
  address,
  address2,
  city,
  postal,
  country,
}: OrderInformationProps) {
  return (
    <div className="w-full mt-6">
      <h1 className="font-semibold font-poppins text-[1.4rem]">
        Order Information
      </h1>
      <div className="flex gap-4 mt-3 w-full">
        <div className="flex-1">
          <h2 className="font-semibold font-poppins">
            Contact
          </h2>

          <Content>
            <span> Email: {email} </span>
            <span> Contact name: {firstname} {lastname} </span>
            <span> Contact phone: {phone} </span>
          </Content>
        </div>

        <div className="flex-1">
          <h2 className="font-semibold">
            Billing address
          </h2>

          <Content>
            <span> {address} </span>
            <span> {address2} </span>
            <span> {city}, {postal} </span>
            <span> {country} </span>
          </Content>
        </div>
      </div>
    </div>
  );
}

export default OrderInformation;
