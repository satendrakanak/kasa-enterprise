"use client";

import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { MapPin, UserRound } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Textarea } from "../ui/textarea";
import { useLocation } from "@/hooks/use-location";
import { useUserCountry } from "@/context/user-country-context";

export const CheckoutForm = () => {
  const { userCountry } = useUserCountry();

  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const {
    countries,
    states,
    cities,
    selectedCountry,
    selectedState,
    selectCountry,
    selectState,
    selectCity,
  } = useLocation();

  const countryValue = watch("country");
  const stateValue = watch("state");
  const cityValue = watch("city");

  useEffect(() => {
    if (userCountry && countries.length > 0 && !selectedCountry) {
      const country = countries.find((c) => c.countryCode === userCountry);

      if (country) {
        selectCountry(country);
        setValue("country", country.name);
      }
    }
  }, [countries, selectedCountry, setValue, selectCountry, userCountry]);

  useEffect(() => {
    if (!countryValue || selectedCountry || countries.length === 0) return;

    const country = countries.find((item) => item.name === countryValue);

    if (!country) return;

    selectCountry(country);
    setValue("country", country.name);
  }, [countries, countryValue, selectedCountry, selectCountry, setValue]);

  useEffect(() => {
    if (!stateValue || selectedState || states.length === 0) return;

    const state = states.find((item) => item.name === stateValue);

    if (!state) return;

    selectState(state);
    setValue("state", state.name);
  }, [selectedState, selectState, setValue, stateValue, states]);

  useEffect(() => {
    if (!cityValue || cities.length === 0) return;

    const city = cities.find((item) => item.name === cityValue);

    if (!city) return;

    selectCity(city);
  }, [cities, cityValue, selectCity]);

  const inputClass =
    "h-12 rounded-2xl border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-none transition focus-visible:border-blue-600 focus-visible:ring-blue-600 dark:border-white/10 dark:bg-[#0b1628] dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-rose-200 dark:focus-visible:ring-rose-200";

  const selectTriggerClass =
    "h-12! rounded-2xl border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 shadow-none transition focus:ring-blue-600 data-[placeholder]:text-slate-400 dark:border-white/10 dark:bg-[#0b1628] dark:text-white dark:focus:ring-rose-200 dark:data-[placeholder]:text-slate-500";

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
      <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5 dark:border-white/10">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
          <MapPin className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
            Billing Address
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Add your billing details exactly as you want them on your invoice.
          </p>
        </div>
      </div>

      <FieldGroup className="gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field>
            <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              First name
            </FieldLabel>

            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="First name"
                  className={inputClass}
                />
              )}
            />

            <FieldError errors={[errors.firstName]} />
          </Field>

          <Field>
            <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Last name
            </FieldLabel>

            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Last name"
                  className={inputClass}
                />
              )}
            />

            <FieldError errors={[errors.lastName]} />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field>
            <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Email address
            </FieldLabel>

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="Email address"
                  className={inputClass}
                />
              )}
            />

            <FieldError errors={[errors.email]} />
          </Field>

          <Field>
            <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Phone number
            </FieldLabel>

            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Phone number"
                  className={inputClass}
                />
              )}
            />

            <FieldError errors={[errors.phoneNumber]} />
          </Field>
        </div>

        <Field>
          <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Full address
          </FieldLabel>

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="House number, street, area"
                className="min-h-24 resize-none rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-none transition focus-visible:border-blue-600 focus-visible:ring-blue-600 dark:border-white/10 dark:bg-[#0b1628] dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-rose-200 dark:focus-visible:ring-rose-200"
              />
            )}
          />

          <FieldError errors={[errors.address]} />
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field>
            <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Country
            </FieldLabel>

            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(value) => {
                    field.onChange(value);

                    const country = countries.find((c) => c.name === value);

                    if (country) {
                      selectCountry(country);
                      setValue("country", country.name);
                      setValue("state", "");
                      setValue("city", "");
                    }
                  }}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>

                  <SelectContent className="border-slate-200 bg-white dark:border-white/10 dark:bg-[#07111f]">
                    {countries.map((country) => (
                      <SelectItem key={country.id} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <FieldError errors={[errors.country]} />
          </Field>

          <Field>
            <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              State
            </FieldLabel>

            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(value) => {
                    field.onChange(value);

                    const state = states.find((s) => s.name === value);

                    if (state) {
                      selectState(state);
                      setValue("state", state.name);
                      setValue("city", "");
                    }
                  }}
                  disabled={!selectedCountry}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>

                  <SelectContent className="border-slate-200 bg-white dark:border-white/10 dark:bg-[#07111f]">
                    {states.map((state) => (
                      <SelectItem key={state.id} value={state.name}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <FieldError errors={[errors.state]} />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field>
            <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              City
            </FieldLabel>

            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(value) => {
                    field.onChange(value);

                    const city = cities.find((item) => item.name === value);
                    if (city) selectCity(city);
                  }}
                  disabled={!selectedState}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>

                  <SelectContent className="border-slate-200 bg-white dark:border-white/10 dark:bg-[#07111f]">
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <FieldError errors={[errors.city]} />
          </Field>

          <Field>
            <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Pincode
            </FieldLabel>

            <Controller
              name="pincode"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Pincode"
                  className={inputClass}
                />
              )}
            />

            <FieldError errors={[errors.pincode]} />
          </Field>
        </div>
      </FieldGroup>

      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-white/10 dark:bg-[#0b1628]">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-blue-700 dark:bg-white/10 dark:text-rose-200">
            <UserRound className="h-4 w-4" />
          </div>

          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            Your billing details will be used for order confirmation,
            certificate records, and invoice generation.
          </p>
        </div>
      </div>
    </section>
  );
};
