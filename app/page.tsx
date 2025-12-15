'use client';
import React, { useState } from 'react';
import { useForm, Controller } from "react-hook-form";

/**
 * Data structure for the registration form. Technically, ito lahat ng andun sa form natin sa BNI
 * then as per sir bryl, dat we define daw what type of data we expect from the form
 */
type RegistrationFormData = {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  chapter: string;
  receipt: FileList;
};
/**
 * Field configuration object for each form input.
 * so dapat it shows pag kinuha si first name = name = label = placeholder = emptymsg 
 * = invalidmsg = required = regex = type = options = accept
 * Defines label, placeholder, validation rules, input type, options, and other metadata.
 * Used by InputField component to dynamically render form fields.
 * finollow ko toh kasi mas madali magmanage ng fields pag ganito
 */
type FieldConfig = {
  name: keyof RegistrationFormData; // nag keyof RegistrationFormData para sumunod sya sa mapping natin sa data object
  label: string; // 
  placeholder: string;
  emptyMsg: string;
  invalidMsg: string;
  required: boolean;
  regex?: RegExp;
  type?: "text" | "number" | "select" | "file" | "email" | "tel";
  options?: string[];
  accept?: string;
};

/**
 * Form field definitions. Ito na yung mga fields na gagamitin sa form natin
 * so when you add a new field, just add it here and it will automatically be rendered in the form
 * madali makita what to change especially pag papapalita nung mga validation rules
 * like regex, emptyMsg, invalidMsg, etc.
 */
const fields: FieldConfig[] = [
  { name: 'firstName', 
    label: 'First Name', 
    placeholder: 'John', 
    type: 'text', 
    regex: /^[a-zA-Z]{2,30}$/, 
    emptyMsg: 'First Name is required.', 
    invalidMsg: 'First Name must be 2-30 alphabetic characters.', 
    required: true 
  },
  { name: 'lastName', 
    label: 'Last Name', 
    placeholder: 'Doe', 
    type: 'text', 
    regex: /^[a-zA-Z]{2,30}$/, 
    emptyMsg: 'Last Name is required.', 
    invalidMsg: 'Last Name must be 2-30 alphabetic characters.', 
    required: true 
  },
  { name: 'email', 
    label: 'Email', 
    placeholder: 'Enter your email', 
    type: 'email', 
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
    emptyMsg: 'Email is required.', 
    invalidMsg: 'Email must be a valid email format.', 
    required: true 
  },
  { name: 'contactNumber', 
    label: 'Contact Number', 
    placeholder: '09171234567', 
    type: 'tel', 
    regex: /^09\d{9}$/, 
    emptyMsg: 'Contact number is required.', 
    invalidMsg: 'Please follow the mobile number format.', 
    required: true 
  },
  { name: 'chapter', 
    label: 'Chapter', 
    placeholder: 'Select a chapter', 
    type: 'select', 
    options: ["All Star","Catalyst","Dauntless","Dynamic","Empire","Elite","Gear","Grit","Iconic","Rise","Trailblazer"], 
    emptyMsg: "Chapter is required.", 
    invalidMsg: "", 
    required: true 
  },
  { name: 'receipt', 
    label: 'Payment Receipt', 
    placeholder: 'Upload receipt', 
    type: 'file', 
    emptyMsg: 'Please upload your receipt.', 
    invalidMsg: '', 
    required: true, 
    accept: 'image/jpeg,image/jpg,image/png' 
  }
];

/**
 * Here, we define the InputField component that will render each form field based on the FieldConfig
 * So nag hhandle sya ng iba't ibang input types like text, select, file upload etc.
 * so pag nag add tayo ng bagong field sa fields array, automatic na sya mare-render dito
 * tipid tips yun sa pag manage ng form inputs and pwede i reuse
 * 
 */
function InputField({
  field,
  register,
  errors,
  control, // rule daw is if hindi daw string use control
  setPreviewSrc,
}: {
  field: FieldConfig;
  register: any; // any toh kasi sa user end and basically use para ma track ung value input for validation
  errors: any; // any din kasi na map out na natin and custom made ung errors natin
  control: any; // Lets us watch field values (useWatch) and manually update them (setValue).
  /**
   * Optional setter para ma-update yung image preview source.
   *
   * Ginagamit to usually daw sa file inputs (like receipt upload)
   * para ma-store yung temporary URL ng uploaded image and ma-display
   * agad yung preview sa UI.
   *
   * Pwede i-set:
   * - string → kapag may image na (e.g. URL.createObjectURL(file))
   * - null → kapag gusto kong i-clear yung preview (after reset)
   */
  setPreviewSrc?: React.Dispatch<React.SetStateAction<string | null>>;
}) {

  /**
 * Base container ng input field.
 * 
 * Dito nilalagay lahat ng shared UI logic ng form fields
 * (label, required indicator, error handling, at input mismo).
 * so kunyare lahat ng text-input bilugan ung input box, white, or may border na ganire
 * para mapadali, ma-manage, at ma-consistent yung UI ng bawat field.
 * so dito na tayo gumagawa nung generic na itsura ng form input depending sa type kaya inassign din natin sila
 * doon sa FieldConfig na object
 */
  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>

      {/* SELECT */}
      {field.type === "select" ? (
        <select
          {...register(field.name, { required: field.emptyMsg })}
          className="w-full p-3 rounded-lg text-black border bg-white h-[50px]"
        >
          <option value="">{field.placeholder}</option>
          {field.options?.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

      /* FILE (Controller) */
      ) : field.type === "file" ? (
        <Controller
          name={field.name}
          control={control}
          rules={{
            required: field.emptyMsg,
            validate: (files: FileList) =>
              files && files.length > 0 || field.emptyMsg,
          }}
          render={({ field: rhfField }) => (
            <div
              className="border-2 border-dashed border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-[#022826] cursor-pointer"
              onClick={() =>
                document.getElementById("input-" + field.name)?.click()
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (!files || files.length === 0) return;

                setPreviewSrc?.(URL.createObjectURL(files[0]));
                rhfField.onChange(files);
              }}
            >
              {rhfField.value && rhfField.value.length > 0 ? (
                <img
                  src={URL.createObjectURL(rhfField.value[0])}
                  alt="Preview"
                  className="max-h-40 rounded-lg border border-gray-300"
                />
              ) : (
                <>
                  <p className="text-gray-300">Drag & drop your image here</p>
                  <p className="text-gray-300">Max size: 2 MB</p>
                  <p className="text-gray-300">Allowed: {field.accept}</p>
                  <button
                    type="button"
                    className="mt-2 px-4 py-2 bg-[#BC904A] text-black rounded-lg font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById("input-" + field.name)?.click();
                    }}
                  >
                    Upload Receipt
                  </button>
                </>
              )}

              <input
                id={"input-" + field.name}
                type="file"
                accept={field.accept}
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;

                  setPreviewSrc?.(URL.createObjectURL(files[0]));
                  rhfField.onChange(files);
                }}
              />
            </div>
          )}
        />
      ) : (
        /* TEXT / EMAIL / TEL */
        <input
          type={field.type || "text"}
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
        <p className="text-red-500 text-sm mt-1">
          {errors[field.name]?.message}
        </p>
      )}
    </div>
  );
}



/**
 * Main Registration Form Component
 * 
 * Renders the registration form with all fields defined in the `fields` array.
 * Handles form submission, validation, and displays success/error messages.
 * mag uutilize sya ng react-hook-form for form state management and validation.
 * so ito na ung nag hhandle ng mismong logic ng form submission, pati na rin yung layout ng buong form
 * unlike sa taas mostly mapping and rendering ng individual fields palang, dito mag gagawa na tyo ng 
 * pano sya ma ssubmit, paano sya mag re react sa success or error, etc.
 * 
 */
export default function RegistrationForm() {
  const {
  register,
  handleSubmit,
  formState: { errors },
  control,
  reset,
  } = useForm<RegistrationFormData>();

  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
 //ito ung tatawag sa onsubmit function pag na submit yung form IF tama at swak lahat ng validations
 // so kinall nya here ung buong registrationformdata na type natin sa taas kasi it uses that to validate
 // and map the form data. then isesend nya sya sa api/registrants route.ts na file
 // for processing and saving. if mali, may error, etc. mag re react sya dito. length === 0 means walang file na na upload
  const onSubmit = async (data: RegistrationFormData) => {
    if (!data.receipt || data.receipt.length === 0) {
      alert("Please upload your receipt.");
      return;
    }
    // ito lahat ng form data isesend sa backend using FormData API which is nasa fetch request below
    // so nag create tayo ng bagong formdata object tapos inappend natin lahat ng fields from data object
    // append means isesend sya as key value pairs sa backend. So inisa isa lahat ng field.
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("contactNumber", data.contactNumber);
    formData.append("chapter", data.chapter);
    formData.append("receipt", data.receipt[0]);
    // sa unang line ng try block, nag fefetch tayo ng POST request sa /api/registrants endpoint
    // which is yung route.ts file na pinakita sa taas. So dito mag poprocess yung form data
    // and save the receipt file and update the registrants.json file.
    // then mag re react sya dito base sa response ng server. If success, mag aalert sya ng success message
    // tapos ireset yung form and preview using reset() then setpreview to null. 
    // If error, mag aalert sya ng error message.
    try {
      const response = await fetch("/api/registrants", { method: "POST", body: formData });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message || "Registration failed");

      alert("Registration successful!");
      reset();
      setPreviewSrc(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error connecting to server");
    }
  };

  return (
    <main className="min-h-screen bg-[#002E2D] text-white flex flex-col items-center p-6">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-18 items-center">

        {/* LEFT INFO SECTION */}
        <div className="flex-1 flex flex-col justify-center items-center">
          <h1 className="text-6xl md:text-7xl text-center font-bold" style={{ color: "white", WebkitTextStroke: "2px #BC904A" }}>WELCOME!</h1>
          <p className="text-[#BC904A] text-center leading-relaxed">9 years. 1 unforgettable night. Let's celebrate what you built this year.</p>
          <p className="text-[#BC904A] text-center leading-relaxed">The referrals you gave. The connections you made. The businesses you helped grow.</p>
          <p className="text-[#BC904A] text-center leading-relaxed">On February 20, we're gathering to recognize our best members and toast to another year of showing up for each other.</p>
          <p className="text-[#BC904A] text-center leading-relaxed">Good food. Great company. The recognition you've earned. Fill out the form below. Let's do this.</p>
          <img src="/bnitaguig.png" alt="BNI Logo" className="w-full md:max-w-[600px] rounded-lg mx-auto" />
          <footer className="flex justify-center mt-4">
            <img src="/QE360Logo.png" className="w-40 opacity-90" />
          </footer>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="flex-1 flex justify-center items-center">
          <section className="bg-[#011E1C] rounded-xl p-6 shadow-xl border-0.5 border-[#BC904A] ring-1 ring-[#BC904A] outline outline-2 outline-[#BC904A] outline-offset-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-4">
                {fields.filter(f => f.name === "firstName" || f.name === "lastName").map(field =>
                  <div key={field.name} className="flex-1">
                    <InputField 
                    field={field} 
                    register={register} 
                    errors={errors} 
                    control={control} />
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                {fields.filter(f => f.name === "contactNumber" || f.name === "chapter").map(field =>
                  <div key={field.name} className="flex-1">
                    <InputField 
                    field={field} 
                    register={register} 
                    errors={errors} 
                    control={control} />
                  </div>
                )}
              </div>
              {fields.filter(f => f.name === "email").map(field =>
                <InputField key={field.name} 
                field={field} 
                register={register} 
                errors={errors} 
                control={control} />
              )}
              {/* PAYMENT GUIDE kept intact */}
              <section className="mt-4">
                <h3 className="text-lg font-bold text-white mt-4">Payment Guide</h3>
                <p className="text-gray-400 mt-2">Please note that the payment amount is based on the current month.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-1 mt-2 text-gray-200">
                  <p className="flex justify-center items-center bg-[#B09561] text-gray-200 font-semibold rounded-xl px-3 py-1">December - ₱3,000</p>
                  <p className="flex justify-center items-center">January - ₱3,500</p>
                  <p className="flex justify-center items-center">Feb 1–19 - ₱3,800</p>
                  <p className="flex justify-center items-center">Feb 20 - ₱5,000</p>
                </div>
                <h4 className="text-gray-400 mt-4">Kindly send your payment to the Union Bank account using the QR code below.</h4>
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                  <img src="/qrcode.png" alt="QR Code" className="w-50 h-50 bg-white p-2 rounded-lg border" />
                  <div className="space-y-1 text-gray-200">
                    <p><strong>Bank:</strong> UnionBank of the Philippines</p>
                    <p><strong>Account Name:</strong> Maria Corazon J. Dorado or Reniegin L. Pinga</p>
                    <p><strong>Account Number:</strong> 1024 0002 0795</p>
                  </div>
                </div>
                <div className="mt-4">
                  <InputField
                    field={fields.find(f => f.name === "receipt")!}
                    register={register}
                    errors={errors}
                    control={control}
                    setPreviewSrc={setPreviewSrc}
                  />
                </div>

              </section>

              <div className="flex gap-4 mt-4">
                <button type="submit" className="px-4 py-2 rounded-lg font-semibold border-2 border-[#BC904A] text-[#BC904A] bg-transparent hover:bg-[#BC904A] hover:text-black transition disabled:opacity-40 disabled:cursor-not-allowed justify-center">Register</button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
