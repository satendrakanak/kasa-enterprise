import * as z from "zod";

export const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email(),
  phoneNumber: z.string().min(10),
  country: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1),
  pincode: z.string().min(4),
});
