export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>
        <p className="text-slate-400 text-center mb-12">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">1. Acceptance of Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              By accessing and using RuSuite, you accept and agree to be bound by the terms and
              provision of this agreement. If you do not agree to these terms, please do not use
              our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">2. Use of Service</h2>
            <div className="text-slate-300 leading-relaxed space-y-3">
              <p>You agree to use RuSuite only for lawful purposes. You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Submit false, misleading, or fraudulent information about servers or services
                </li>
                <li>Manipulate the voting system through automated means or multiple accounts</li>
                <li>Upload malicious content or links to harmful websites</li>
                <li>Harass, abuse, or harm other users of the platform</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">3. Server Listings</h2>
            <div className="text-slate-300 leading-relaxed space-y-3">
              <p>
                Server owners who list their servers on RuSuite agree that all information provided
                is accurate and up-to-date. We reserve the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Review and approve or reject any server listing</li>
                <li>Remove listings that violate our terms or community guidelines</li>
                <li>Suspend or ban users who abuse the platform</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">4. User Accounts</h2>
            <p className="text-slate-300 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials.
              You agree to notify us immediately of any unauthorized use of your account. We are
              not liable for any loss or damage arising from your failure to protect your account
              information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">5. Voting System</h2>
            <p className="text-slate-300 leading-relaxed">
              Our voting system is designed to be fair and prevent abuse. Attempts to manipulate
              votes through bots, multiple accounts, or other fraudulent means will result in
              immediate account suspension and removal of affected votes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">6. Content Ownership</h2>
            <p className="text-slate-300 leading-relaxed">
              You retain ownership of any content you submit to RuSuite. By submitting content, you
              grant us a non-exclusive, worldwide, royalty-free license to use, display, and
              distribute your content on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">7. Disclaimer</h2>
            <p className="text-slate-300 leading-relaxed">
              RuSuite is provided "as is" without any warranties, expressed or implied. We do not
              guarantee the accuracy, reliability, or availability of the service. We are not
              responsible for the content or actions of servers listed on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">8. Limitation of Liability</h2>
            <p className="text-slate-300 leading-relaxed">
              RuSuite and its operators shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use of or inability to use the
              service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">9. Third-Party Links</h2>
            <p className="text-slate-300 leading-relaxed">
              Our service may contain links to third-party websites or services. We are not
              responsible for the content, privacy policies, or practices of any third-party sites.
              You access these sites at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">10. Modifications to Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting to the website. Your continued use of RuSuite after changes
              are posted constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">11. Termination</h2>
            <p className="text-slate-300 leading-relaxed">
              We may terminate or suspend your account and access to the service immediately,
              without prior notice or liability, for any reason, including breach of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">12. Contact Information</h2>
            <p className="text-slate-300 leading-relaxed">
              If you have any questions about these Terms, please contact us at:
              <br />
              <span className="text-amber-500 font-semibold">support@rusuite.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
