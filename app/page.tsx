"use client";

import { useState } from "react";

export default function Page() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    contactNumber: "",
    chapter: "",
    email: "",
    filename: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFormData({ ...formData, filename: e.target.files[0].name });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please upload a file.");
      return;
    }
//sinesend ng frontend ung data to backend//
    try { 
      const response = await fetch("/api/registrants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json(); //read nya ung response from backend//
      if (response.ok) {
        setMessage("Registration successful!");
        setFormData({ firstname: "", lastname: "", contactNumber: "", chapter: "", email: "", filename: "" });
        setFile(null);
      } else {
        setMessage(data.message || "Error registering.");
      }
    } catch {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div className="min-h-screen bg-[#002E2D] text-[#966919] font-sans p-6 flex flex-col lg:flex-row gap-6">
      {/* LEFT COLUMN */}
      <section className="flex-1 p-8 text-center">
        <h2 className="text-[3rem] font-bold text-[#966919] drop-shadow-[0_0_5px_#fff] drop-shadow-[0_0_10px_#FFD700] mb-5">
          WELCOME!
        </h2>
        <p className="mb-1">9 years. 1 unforgettable night.</p>
        <p className="mb-1">Let's celebrate what you.</p>
        <p className="mb-1">The referrals you gave. The connection you made. The business you helped grow.</p>
        <p className="mb-1">On February 20, we're gathering to recognize our best members and toast to another year of showing up for each other.</p>
        <p className="mb-1">Good food. Great company. The recognition you've earned.</p>
        <p className="mb-6">Fill out the form below. Let's do this.</p>

        <div className="mt-5">
          <img src="/bni.png" alt="Event Poster" className="mx-auto max-w-[80%] mb-4" />
          <div className="text-[#966919] text-lg">
            Powered by <img src="/qe360.jpg" alt="Logo" className="inline h-5 ml-1" /> https://www.qe-360.com
          </div>
        </div>
      </section>

      {/* RIGHT COLUMN */}
      <section className="flex-1 p-8 bg-[#00272e] border-4 border-double border-[#966919] rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Row */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 flex flex-col">
              <label className="font-bold text-[#ccc]" htmlFor="firstname">
                First Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="firstname"
                id="firstname"
                className="p-2 rounded border-none text-black bg-white"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="font-bold text-[#ccc]" htmlFor="lastname">
                Last Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                className="p-2 rounded border-none text-black bg-white"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Contact & Chapter */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 flex flex-col">
              <label className="font-bold text-[#ccc]" htmlFor="contactNumber">
                Contact Number <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                name="contactNumber"
                id="contactNumber"
                className="p-2 rounded border-none text-black bg-white"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="font-bold text-[#ccc]" htmlFor="chapter">
                Chapter <span className="text-red-600">*</span>
              </label>
              <select
                name="chapter"
                id="chapter"
                className="p-2 rounded border-none text-black bg-white"
                value={formData.chapter}
                onChange={handleChange}
                required
              >
                <option value="">Select Chapter</option>
                <option value="All-Stars">All-Stars</option>
                <option value="Catalyst">Catalyst</option>
                <option value="Dauntless">Dauntless</option>
                <option value="Dynamic">Dynamic</option>
                <option value="Empire">Empire</option>
                <option value="Elite">Elite</option>
                <option value="Gear">Gear</option>
                <option value="Grit">Grit</option>
                <option value="Iconic">Iconic</option>
                <option value="Rise">Rise</option>
                <option value="Trailbazer">Trailblazer</option>
              </select>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="font-bold text-[#ccc]" htmlFor="email">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="p-2 rounded border-none text-black bg-white"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Payment Guide */}
          <div className="text-[#ccc] mb-4">
            <h3 className="text-white mb-2 font-bold">Payment Guide</h3>
            <p className="mb-1">Please note that the payment amount is based on the current month.</p>
            <ul className="pl-5 list-disc">
              <li>November: ₱2,500</li>
              <li className="font-bold text-[#FFD700]">December: ₱3,000</li>
              <li>February 1-19: ₱3,800</li>
              <li>February 20: ₱5,000</li>
            </ul>
            <p className="mt-1">Kindly send your payment to the Union Bank using the QR code below.</p>
          </div>

          {/* QR + Bank */}
          <div className="flex flex-col lg:flex-row gap-4 items-start mb-4">
            <img src="/qrr.png" alt="QR Code" className="w-44 border-2 border-[#966919] rounded-lg" />
            <div className="flex-1 text-[#ccc]">
              <p><strong>Union Bank QR Code</strong></p>
              <p><strong>Bank:</strong> UnionBank of the Philippines</p>
              <p><strong>Account Name:</strong> Maria Corazon J. Dorado or Reneigin L. Pinga</p>
              <p><strong>Account Number:</strong> 1024 0002 0795</p>
            </div>
          </div>

          {/* Proof of Payment */}
          <div className="flex flex-col">
            <label className="font-bold text-[#ccc]" htmlFor="proof-of-payment">
              Proof of Payment <span className="text-red-600">*</span>
            </label>
            <div className="border-2 border-[#ccc] rounded p-4 mb-4 bg-[#003138] flex flex-col items-start">
              <p>Drag and drop files here. Max file size: 2MB. File format: .jpg, .jpeg, .png</p>
              <input type="file" id="proof-of-payment" accept=".jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" required />
              <button type="button" className="mt-2 px-4 py-2 border-2 border-[#966919] rounded text-white font-bold hover:bg-[#966919] hover:text-[#00272e]" onClick={() => document.getElementById("proof-of-payment")?.click()}>
                Choose File
              </button>
              {file && <span className="mt-2 text-[#ccc]">{file.name}</span>}
            </div>
          </div>

          <button type="submit" className="px-4 py-2 border-2 border-[#966919] rounded text-[#ccc] font-bold hover:bg-[#966919] hover:text-[#00272e]">
            Register
          </button>
          {message && <p className="mt-2 text-red-500">{message}</p>}
        </form>
      </section>
    </div>
  );
}
