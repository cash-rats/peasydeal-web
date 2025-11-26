export type AddressParts = 'line1' | 'line2' | 'city' | 'county' | 'country';

export type AddressOption = {
  [key in AddressParts]: string;
}
