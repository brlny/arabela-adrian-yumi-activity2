import React from "react";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#002E2D] text-white flex flex-col items-center p-6">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
        {/* LEFT SIDE */}
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl text-center text-[#BC904A] font-bold">Welcome!</h1>
          <p className="text-[#BC904A] mb-3 text-center text-lg leading-relaxed">9 years. 1 unforgettable night.</p>
          <p className="text-[#BC904A] mb-3 text-center text-lg leading-relaxed">Let's celebrate what you built this year.</p>
          <p className="text-[#BC904A] mb-3 text-center text-lg leading-relaxed">The referrals you gave. The connections you made. The businesses you helped grow.</p>
          <p className="text-[#BC904A] mb-3 text-center text-lg leading-relaxed">On February 20, we're gathering to recognize our best members and toast to another year of showing up for each other.</p>
          <p className="text-[#BC904A] mb-3 text-center text-lg leading-relaxed">Good food. Great company. The recognition you've earned.</p>
          <p className="text-[#BC904A] mb-3 text-center text-lg leading-relaxed">Fill out the form below. Let's do this.</p>

          <header className="flex flex-col items-center text-center gap-3 mt-4">
            <img src="/bni9logo.png" alt="BNI Taguig at 9 Logo" className="w-full max-w-[350px] rounded-lg" />
          </header>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1">
          <section className="bg-[#011E1C] rounded-xl p-6 shadow-xl">
            <form id="registrationForm" noValidate className="space-y-4">
              {/* NAME ROW */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="font-semibold mb-1 block">First Name</label>
                  <input type="text" required className="w-full p-3 rounded-lg text-black border bg-white" />
                </div>

                <div className="flex-1">
                  <label className="font-semibold mb-1 block">Last Name</label>
                  <input type="text" required className="w-full p-3 rounded-lg text-black border bg-white" />
                </div>
              </div>

              {/* CONTACT + CHAPTER */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="font-semibold mb-1 block">Contact Number</label>
                  <input type="tel" placeholder="+63xxxxxxxxxx" required className="w-full p-3 rounded-lg text-black border bg-white" />
                </div>

                <div className="flex-1">
                  <label className="font-semibold mb-1 block">Chapter</label>
                  <select required className="w-full p-3 rounded-lg text-black border bg-white">
                    <option value="">Select chapter</option>
                    <option>All Star</option>
                    <option>Catalyst</option>
                    <option>Dauntless</option>
                    <option>Dynamic</option>
                    <option>Empire</option>
                    <option>Elite</option>
                    <option>Gear</option>
                    <option>Grit</option>
                    <option>Iconic</option>
                    <option>Rise</option>
                    <option>Trailblazer</option>
                  </select>
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="font-semibold mb-1 block">Email</label>
                <input type="email" required className="w-full p-3 rounded-lg text-black border bg-white" />
              </div>

              <hr className="border-gray-600" />

              {/* PAYMENT GUIDE */}
              <section>
  <h2 className="text-lg font-bold mb-2">Payment guide</h2>
  <p className="text-gray-400 mb-4">
    Please note that the payment amount is based on the current month.
    <strong> November ₱2,500; December ₱3,000; Feb 1–19 ₱3,800; Feb 20 ₱5,000</strong>.
  </p>

  <div className="flex flex-col md:flex-row gap-4">
    <div className="flex-1">
      <label className="font-semibold mb-1 block">Payment Period</label>

        <p className="w-full p-1 rounded-lg text-black border bg-gray-200">November ₱2,500</p>
        <p className="3000">December ₱3,000</p>
        <p className="3800">Feb 1–19 ₱3,800</p>
        <p className="5000">Feb 20 ₱5,000</p>
    </div>

                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-4 items-center">
                  <img src="qrcode.png" className="w-32 h-32 bg-white p-2 rounded-lg border" />
                  <div className="text-gray-300 text-sm">
                    <p><strong>Bank:</strong> UnionBank of the Philippines</p>
                    <p><strong>Account Name:</strong> Maria Corazon J. Dorado or Reniegin L. Pinga</p>
                    <p><strong>Account Number:</strong> 1024 0002 0795</p>
                  </div>
                </div>
              </section>

              <hr className="border-gray-600" />

              {/* FILE UPLOAD */}
              <section>
                <label className="font-semibold mb-2 block">Proof of Payment</label>
                <div className="border-2 border-dashed border-gray-400 p-6 rounded-xl text-center bg-white/20 cursor-pointer">
                <div id="dropZone" className="drop-zone"></div>
                  <p>Drag and drop files here</p>
                  <p className="text-gray-400 text-sm">Max file size: 2MB · File format: .jpg .jpeg .png</p>
                  <input id="fileInput" type="file" accept=".jpg,.jpeg,.png" required/>
                </div>
              </section>

              {/* BUTTONS */}
              <div className="flex gap-4 mt-4">
                <button type="submit" className="px-5 py-3 bg-blue-600 rounded-lg text-white font-semibold">Register</button>
                <button type="reset" className="px-5 py-3 bg-white text-black rounded-lg font-semibold">Reset</button>
              </div>
            </form>
          </section>

          <footer className="flex justify-center mt-4">
            <img src="QE360Logo.png" className="w-40 opacity-90" />
          </footer>
        </div>
      </div>
    </main>
  );
}