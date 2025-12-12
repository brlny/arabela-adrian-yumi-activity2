'use client';

/**
  * import necessary modules and libraries
  * react for building the component even though may hook form na tayo
  * useState for managing state within the component
  * useForm from react-hook-form para sa form handling and validation which is need i map para sa custom form handling
  * zod for schema validation sabi sa yt though di ko pa nagagamit
 */
import React from 'react';
import { useState } from 'react';
import { useForm, useWatch, useFormContext } from "react-hook-form";
import { z } from 'zod';


/**
  * Registration Form Component
  * handles user registration inputs and validations
  * dinefine lang ung type para sa form data and 
  * required false para sa di naman required fields and i eenable nalang if required
 */

type registrationForms = {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: number;
  chapter: string;
  receipt: Blob;
};

/**
  * type responsible for defining the structure of each form field's metadata
  * used to store validation rules and display information for each input field
  */

 
type FormData = {
  name: keyof registrationForms;
  label: string;
  placeholder: string;
  emptyMsg: string;
  invalidMsg: string;
  required: boolean;
  regex?: RegExp;
  type?: "text" | "number" | "select" | "file";
  options?: string[];

};
/**
  * fields Array for Registration Form
  * so mag gagamit tayo ng array para ma map natin ung mga fields sa form and to add validation rules
  * for each objects i define ung name,label,placeholder,regex,emptymsg,invalidmsg
  * regex for validation pattern
  * then babalikan natin toh later if mag re render tayo ng form inputs 
  * so example si firstName sa type natin sa registrationForms nasa name na sya contained as formsData here pero
  * dito expounded version sa na nung registrationForms type
 */
const fields: FormData[] = [
    {
    name: 'firstName',
    label: 'First Name',
    placeholder: 'John',
    type: 'text',
    regex: /^[a-zA-Z]{2,30}$/,          
    emptyMsg: 'First Name is required.',
    invalidMsg: 'First Name must be 2-30 alphabetic characters.',
    required: true,
  },
  {
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Doe',
    type: 'text',
    regex: /^[a-zA-Z]{2,30}$/,
    emptyMsg: 'Last Name is required.',
    invalidMsg: 'Last Name must be 2-30 alphabetic characters.',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'text',
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    emptyMsg: 'Email is required.',
    invalidMsg: 'Email must be a valid email format.',
    required: true,
  },
  {
    name: 'contactNumber',
    label: 'Contact Number',
    placeholder: 'e.g. 09171234567',
    type: 'number',
    regex: /^\+\d{2}\s\d{3}\s\d{4,}$/,
    emptyMsg: 'Contact number is required.',
    invalidMsg: 'Please follow the mobile number format (+xx xxx xxxx ...)',
    required: true,
  },
  {
    name: "chapter",
    label: "Chapter",
    placeholder: "Select a chapter",
    type: "select",
    options: [ 
      "All Star", 
      "Catalyst", 
      "Dauntless", 
      "Dynamic",
      "Empire", 
      "Elite", 
      "Gear", 
      "Grit", 
      "Iconic", 
      "Rise", 
      "Trailblazer"
    ],
    emptyMsg: "Chapter is required.",
    invalidMsg: "",
    required: true,
  },
  {
    name: 'receipt',
    label: 'Receipt',
    placeholder: 'Upload your payment receipt',
    type: 'file',
    emptyMsg: 'Please upload your receipt.',
    invalidMsg: 'File size must be 2MB or less.',
    required: true,
  },
    

];
/**
  * form input field component
  * reusable component to render individual form input fields based on provided metadata
  * accepts field metadata, register function from react-hook-form, and any validation errors
  * conditionally renders input or select element based on field type
  * displays validation error messages when applicable 
  * dito din dapat mag iimplement ng file upload input and ung asterisk for required fields
  * di pa nagagawa ung file upload and asterisk for required fields
 */

function InputField({
  field,
  register,
  errors,
  control,
  setPreviewSrc, // pass only for file field
}: {
  field: FormData;
  register: any;
  errors: any;
  control: any;
  setPreviewSrc?: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const value = useWatch({ control, name: field.name }); // watch field value

  // Show asterisk if required and value is empty or invalid
  const showAsterisk = field.required && (!value || (field.regex && !field.regex.test(value)));


  // Handler for file change (only needed for receipt upload)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (setPreviewSrc) setPreviewSrc(URL.createObjectURL(file));
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">
        {field.label} {showAsterisk && <span className="text-red-500">*</span>}
      </label>

      {field.type === 'select' ? (
        <select
          {...register(field.name, { required: field.emptyMsg })}
          className="w-full p-3 rounded-lg text-black border bg-white h-[50px]"
        >
          <option value="">{field.placeholder}</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === 'file' ? (
        <div
          className="border-2 border-dashed border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-[#022826] relative cursor-pointer"
          onClick={() => document.getElementById('payment-input')?.click()}
        >
          {value?.[0] ? (
            <img
              src={URL.createObjectURL(value[0])}
              alt="Preview"
              className="max-h-40 rounded-lg border border-gray-300"
            />
          ) : (
            <>
              <p className="text-gray-300">Drag & drop your image here</p>
              <p className="text-gray-300">Max size: 2 MB</p>
              <p className="text-gray-300">Allowed: .jpg, .jpeg, .png</p>
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-[#BC904A] text-black rounded-lg font-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById('payment-input')?.click();
                }}
              >
                Upload Receipt
              </button>
            </>
          )}

          <input
            type="file"
            id="payment-input"
            accept="image/jpeg, image/jpg, image/png"
            className="hidden"
            {...register(field.name, { required: field.emptyMsg })}
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <input
          type={field.type || 'text'}
          placeholder={field.placeholder}
          {...register(field.name, {
            required: field.emptyMsg,
            ...(field.regex && {
              pattern: { value: field.regex, message: field.invalidMsg },
            }),
          })}
          className="w-full p-3 rounded-lg text-black border bg-white"
        />
      )}

      {errors[field.name] && (
        <p className="text-red-500 text-sm mt-1">{errors[field.name]?.message}</p>
      )}
    </div>
  );
}


/**
  * RegistrationForm Component
  * bali sinet natin ung state para sa bawat input field para ma handle ung state ng bawat input field
  * firstName for first name input which is set to empty string initially same with others
  * sa blob set to null initially since dapat empty sya and lalagyan sa pag upload ng file
 */

export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<registrationForms>();

  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const onSubmit = (data: registrationForms) => {
    console.log("Form Data Submitted:", data);
  };

  return (
    <main className="min-h-screen bg-[#002E2D] text-white flex flex-col items-center p-6">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-18 items-center">

        {/* LEFT INFO SECTION */}
        <div className="flex-1 flex flex-col justify-center items-center">
          <h1
            className="text-6xl md:text-8xl text-center font-bold"
            style={{
              color: "white",
              WebkitTextStroke: "2px #BC904A"
            }}
          > WELCOME! 

          </h1>
          <p className="text-[#BC904A] text-center leading-relaxed">
            9 years. 1 unforgettable night. Let's celebrate what you built this year.
          </p>
          <p className="text-[#BC904A] text-center leading-relaxed">
            The referrals you gave. The connections you made. The businesses you helped grow.
          </p>
          <p className="text-[#BC904A] text-center leading-relaxed">
            On February 20, we're gathering to recognize our best members and toast to another year of showing up for each other.
          </p>
          <p className="text-[#BC904A] text-center leading-relaxed">
            Good food. Great company. The recognition you've earned. Fill out the form below. Let's do this.
          </p>
          <img src="/bnitaguig.png" alt="BNI Logo" className="w-full md:max-w-[600px] rounded-lg mx-auto" />

          <footer className="flex justify-center mt-4">
            <img src="/QE360Logo.png" className="w-40 opacity-90" />
          </footer>

        </div>

        {/* RIGHT FORM SECTION */}
        <div className="flex-1 flex justify-center items-center ">
          <section className="bg-[#011E1C] rounded-xl p-6 shadow-xl border-0.5 border-[#BC904A] ring-1 ring-[#BC904A] outline outline-2 outline-[#BC904A] outline-offset-5 ">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* ROW 1: First Name & Last Name */}
              <div className="flex gap-4">
                {fields
                  .filter(f => f.name === "firstName" || f.name === "lastName")
                  .map(field => (
                    <div key={field.name} className="flex-1">
                      <InputField
                        field={field}
                        register={register}
                        errors={errors}
                        control={control}
                      />
                    </div>
                  ))}
              </div>


              {/* ROW 2: Contact Number & Chapter */}
              <div className="flex gap-4">
                {fields
                  .filter(f => f.name === "contactNumber" || f.name === "chapter")
                  .map(field => (
                    <div key={field.name} className="flex-1">
                      <InputField
                        field={field}
                        register={register}
                        errors={errors}
                        control={control}
                      />
                    </div>
                  ))}
              </div>



              {/* ROW 3: Email */}
              {fields.filter(f => f.name === "email").map(field => (
                <InputField
                  key={field.name}
                  field={field}
                  register={register}
                  errors={errors}
                  control={control}
                />
              ))}


              {/* PAYMENT GUIDE */}
              <section className="mt-4">
                <h3 className="text-lg font-bold text-white mt-4">Payment Guide</h3>
                <p className="text-gray-400 mt-2">
                  Please note that the payment amount is based on the current month.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-1 mt-2 text-gray-200">
                  <p className="flex justify-center items-center bg-[#B09561] text-gray-200 font-semibold rounded-xl px-3 py-1">December - ₱3,000</p>
                  <p className="flex justify-center items-center">January - ₱3,500</p>
                  <p className="flex justify-center items-center">Feb 1–19 - ₱3,800</p>
                  <p className="flex justify-center items-center">Feb 20 - ₱5,000</p>
                </div>

                <h4 className="text-gray-400 mt-4">
                  Kindly send your payment to the Union Bank account using the QR code below.
                </h4>

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                  <img src="/qrcode.png" alt="QR Code" className="w-50 h-50 bg-white p-2 rounded-lg border" />
                  <div className="space-y-1 text-gray-200">
                    <p><strong>Bank:</strong> UnionBank of the Philippines</p>
                    <p><strong>Account Name:</strong> Maria Corazon J. Dorado or Reniegin L. Pinga</p>
                    <p><strong>Account Number:</strong> 1024 0002 0795</p>
                  </div>
                </div>

                {/* PAYMENT RECEIPT */}
                <div className="mt-4">
                  <label className="block mb-2 font-semibold text-white">Payment Receipt:</label>

                  <div
                    className="border-2 border-dashed border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-[#022826] relative cursor-pointer"
                    onClick={() => document.getElementById('payment-input')?.click()}
                  >
                    {previewSrc ? (
                      // Show preview inside dropzone
                      <img
                        src={previewSrc}
                        alt="Preview"
                        className="max-h-40 rounded-lg border border-gray-300"
                      />
                    ) : (
                      <>
                        <p className="text-gray-300">Drag & drop your image here</p>
                        <p className="text-gray-300">Max size: 2 MB</p>
                        <p className="text-gray-300">Allowed: .jpg, .jpeg, .png</p>
                        <button
                          type="button"
                          className="mt-2 px-4 py-2 bg-[#BC904A] text-gray-300 rounded-lg font-semibold"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('payment-input')?.click();
                          }}
                        >
                          Upload Receipt
                        </button>
                      </>
                    )}

                    {/* Hidden file input */}
                    <input
                      type="file"
                      id="payment-input"
                      accept="image/jpeg, image/jpg, image/png"
                      className="hidden"
                      {...register('receipt', { required: 'Please upload your receipt.' })}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setPreviewSrc(URL.createObjectURL(file));
                      }}
                    />
                  </div>

                  {errors.receipt && (
                    <p className="text-red-500 text-sm mt-1">{errors.receipt?.message}</p>
                  )}
                </div>


              </section>

              {/* BUTTONS */}
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="
                    px-4 py-2 rounded-lg font-semibold
                    border-2 border-[#BC904A]
                    text-[#BC904A]
                    bg-transparent
                    hover:bg-[#BC904A] hover:text-black
                    transition
                    disabled:opacity-40 disabled:cursor-not-allowed
                    justify-center
                  "
                  
                >
                  Register
                </button>
              </div>
            </form>
          </section>


        </div>
      </div>
    </main>
  );
}

