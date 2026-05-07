"use client";

import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { MapPin } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
      const country = countries.find(
        (item) => item.countryCode === userCountry,
      );

      if (country) {
        selectCountry(country);
        setValue("country", country.name);
      }
    }
  }, [countries, selectedCountry, setValue, selectCountry, userCountry]);

  useEffect(() => {
    if (!countryValue || selectedCountry || countries.length === 0) return;

    const country = countries.find((item) => item.name === countryValue);

    if (country) {
      selectCountry(country);
      setValue("country", country.name);
    }
  }, [countries, countryValue, selectedCountry, selectCountry, setValue]);

  useEffect(() => {
    if (!stateValue || selectedState || states.length === 0) return;

    const state = states.find((item) => item.name === stateValue);

    if (state) {
      selectState(state);
      setValue("state", state.name);
    }
  }, [selectedState, selectState, setValue, stateValue, states]);

  useEffect(() => {
    if (!cityValue || cities.length === 0) return;

    const city = cities.find((item) => item.name === cityValue);

    if (city) {
      selectCity(city);
    }
  }, [cities, cityValue, selectCity]);

  const inputClass =
    "h-12 rounded-2xl border-border bg-muted px-4 text-sm text-foreground placeholder:text-muted-foreground shadow-none transition focus-visible:border-primary focus-visible:ring-primary";

  const textareaClass =
    "min-h-24 resize-none rounded-2xl border-border bg-muted px-4 py-4 text-sm text-foreground placeholder:text-muted-foreground shadow-none transition focus-visible:border-primary focus-visible:ring-primary";

  const selectTriggerClass =
    "h-12! rounded-2xl border-border bg-muted px-4 text-sm text-foreground shadow-none transition focus:ring-primary data-[placeholder]:text-muted-foreground";

  const selectContentClass = "border-border bg-popover text-popover-foreground";

  return (
    <section className="academy-card p-5 md:p-6">
      <div className="mb-6 flex items-start gap-3 border-b border-border pb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
          <MapPin className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-card-foreground">
            Billing Address
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Add your billing details exactly as you want them on your invoice.
          </p>
        </div>
      </div>

      <FieldGroup className="gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field>
            <FieldLabel className="text-sm font-semibold text-card-foreground">
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
            <FieldLabel className="text-sm font-semibold text-card-foreground">
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
            <FieldLabel className="text-sm font-semibold text-card-foreground">
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
            <FieldLabel className="text-sm font-semibold text-card-foreground">
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
          <FieldLabel className="text-sm font-semibold text-card-foreground">
            Full address
          </FieldLabel>

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="House number, street, area"
                className={textareaClass}
              />
            )}
          />

          <FieldError errors={[errors.address]} />
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field>
            <FieldLabel className="text-sm font-semibold text-card-foreground">
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

                    const country = countries.find(
                      (item) => item.name === value,
                    );

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

                  <SelectContent className={selectContentClass}>
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
            <FieldLabel className="text-sm font-semibold text-card-foreground">
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

                    const state = states.find((item) => item.name === value);

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

                  <SelectContent className={selectContentClass}>
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
            <FieldLabel className="text-sm font-semibold text-card-foreground">
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

                    if (city) {
                      selectCity(city);
                      setValue("city", city.name);
                    }
                  }}
                  disabled={!selectedState}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>

                  <SelectContent className={selectContentClass}>
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
            <FieldLabel className="text-sm font-semibold text-card-foreground">
              Postal code
            </FieldLabel>

            <Controller
              name="postalCode"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Postal code"
                  className={inputClass}
                />
              )}
            />

            <FieldError errors={[errors.postalCode]} />
          </Field>
        </div>
      </FieldGroup>
    </section>
  );
};
