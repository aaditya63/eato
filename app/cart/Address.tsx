"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Trash2 } from "lucide-react";
import axios from "axios";

export default function Address({
  form,
  setForm,
  isAddressChanged,
  setIsAddressChanged,
  isAddressSelected,
  setIsAddressSelected,
}: any) {
  const [errors, setErrors] = useState({
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
    if (!isAddressChanged) {
      setIsAddressChanged(true);
    }
  }

  function validateForm() {
    let newErrors: any = {};
    if (!form.addressLine1.trim())
      newErrors.addressLine1 = "Address Line 1 is required.";
    if (!form.city.trim()) newErrors.city = "City is required.";

    // Postal Code → must be 6 digits
    if (!/^\d{6}$/.test(form.postalCode)) {
      newErrors.postalCode = "Postal code must be exactly 6 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  function handleClearForm() {
    setForm({
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "Maharashtra",
      postalCode: "",
      country: "India",
    });
    if (!isAddressChanged) {
      setIsAddressChanged(true);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/address`,
        {
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2 ?? "",
          city: form.city,
          state: "Maharashtra",
          postalCode: form.postalCode,
          country: "India",
        }
      );
      if (res.data.success) {
        console.log(res);
        setIsAddressChanged(false);
        setIsAddressSelected(true);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Home className="w-5 h-5" /> Confirm Address
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Address Line 1 */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium mb-1 block">
            Address Line 1
          </label>
          <Input
            name="addressLine1"
            value={form.addressLine1}
            onChange={handleChange}
            placeholder="Apartment, house number"
            className={`${
              errors.addressLine1 ? "border-red-500" : ""
            } bg-white`}
          />
          {errors.addressLine1 && (
            <p className="text-red-600 text-sm mt-1">{errors.addressLine1}</p>
          )}
        </div>

        {/* Address Line 2 */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium mb-1 block">
            Address Line 2
          </label>
          <Input
            name="addressLine2"
            value={form.addressLine2}
            onChange={handleChange}
            placeholder="Area, landmark (Optional)"
            className="bg-white"
          />
        </div>

        {/* City */}
        <div>
          <label className="text-sm font-medium mb-1 block">City</label>
          <Input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            className={`${errors.city ? "border-red-500" : ""} bg-white`}
          />
          {errors.city && (
            <p className="text-red-600 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="text-sm font-medium mb-1 block">State</label>
          <Input
            name="state"
            value={form.state}
            onChange={handleChange}
            disabled={true}
            placeholder="State"
            className={`${errors.state ? "border-red-500" : ""} bg-white`}
          />
          {errors.state && (
            <p className="text-red-600 text-sm mt-1">{errors.state}</p>
          )}
        </div>

        {/* Postal Code */}
        <div>
          <label className="text-sm font-medium mb-1 block">Postal Code</label>
          <Input
            maxLength={6}
            name="postalCode"
            value={form.postalCode}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, "");
              if (!isAddressChanged) {
                setIsAddressChanged(true);
              }
              setForm({ ...form, postalCode: onlyNumbers });
            }}
            placeholder="PIN Code"
            className={`${errors.postalCode ? "border-red-500" : ""} bg-white`}
          />
          {errors.postalCode && (
            <p className="text-red-600 text-sm mt-1">{errors.postalCode}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="text-sm font-medium mb-1 block">Country</label>
          <Input
            name="country"
            value={form.country}
            onChange={handleChange}
            disabled={true}
            placeholder="Country"
            className="bg-white"
          />
          {errors.country && (
            <p className="text-red-600 text-sm mt-1">{errors.country}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-end mt-2 gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleClearForm}
          >
            <Trash2 className="w-4 h-4" />
            {"Clear"}
          </Button>
          <Button
            type="submit"
            className="flex items-center gap-2 bg-textxsecondary hover:bg-btnxsecondary/90 cursor-pointer"
            disabled={loading || !isAddressChanged}
          >
            <MapPin className="w-4 h-4" />
            {loading ? "Updating..." : "Update Address"}
          </Button>
        </div>
      </form>
    </div>
  );
}
