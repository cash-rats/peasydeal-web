export type AddressParts = 'line1' | 'line2' | 'city' | 'county' | 'country';

export type Option = {
  [key in AddressParts]: string;
}
