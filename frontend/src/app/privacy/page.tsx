export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        <p className="text-slate-400 text-center mb-12">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">1. Introduction</h2>
            <p className="text-slate-300 leading-relaxed">
              RuSuite ("we", "our", or "us") is committed to protecting your privacy. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your information when
              you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">2. Information We Collect</h2>
            <div className="text-slate-300 leading-relaxed space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-2">Personal Information</h3>
                <p>When you register for an account, we collect:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Email address</li>
                  <li>Password (encrypted)</li>
                  <li>Account creation date</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Server Information</h3>
                <p>When you list a server, we collect:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Server name and description</li>
                  <li>Server URLs (website, Discord, client download)</li>
                  <li>Banner images</li>
                  <li>Tags and game type</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Usage Information</h3>
                <p>We automatically collect:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>IP address (for voting and security purposes)</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent</li>
                  <li>Click data on server links</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">3. How We Use Your Information</h2>
            <div className="text-slate-300 leading-relaxed">
              <p className="mb-3">We use the collected information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our service</li>
                <li>Process and manage server listings</li>
                <li>Implement and monitor the voting system</li>
                <li>Prevent abuse and maintain platform integrity</li>
                <li>Send important service updates and notifications</li>
                <li>Improve and optimize our platform</li>
                <li>Respond to your requests and support inquiries</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">4. Information Sharing</h2>
            <div className="text-slate-300 leading-relaxed space-y-3">
              <p>We do not sell your personal information. We may share information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  With service providers who assist in operating our platform (hosting, analytics)
                </li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or acquisition</li>
                <li>
                  Publicly, in the case of server information (which is intended to be displayed to
                  users)
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">5. Cookies and Tracking</h2>
            <p className="text-slate-300 leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our service and
              hold certain information. You can instruct your browser to refuse all cookies or to
              indicate when a cookie is being sent. However, some parts of our service may not
              function properly without cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">6. Data Security</h2>
            <p className="text-slate-300 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your
              personal information. However, no method of transmission over the Internet or
              electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">7. Data Retention</h2>
            <p className="text-slate-300 leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the
              purposes outlined in this Privacy Policy. We will retain and use your information to
              comply with legal obligations, resolve disputes, and enforce our agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">8. Your Rights</h2>
            <div className="text-slate-300 leading-relaxed">
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and receive a copy of your personal data</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict processing of your data</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at{' '}
                <span className="text-amber-500 font-semibold">support@rusuite.com</span>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">9. Third-Party Services</h2>
            <p className="text-slate-300 leading-relaxed">
              Our service may contain links to third-party websites. We are not responsible for the
              privacy practices of these sites. We encourage you to review the privacy policies of
              any third-party sites you visit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">10. Children's Privacy</h2>
            <p className="text-slate-300 leading-relaxed">
              Our service is not intended for children under 13 years of age. We do not knowingly
              collect personal information from children under 13. If you believe we have collected
              information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">11. International Data Transfers</h2>
            <p className="text-slate-300 leading-relaxed">
              Your information may be transferred to and maintained on computers located outside of
              your state, province, country, or other governmental jurisdiction where data
              protection laws may differ. By using our service, you consent to such transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">12. Changes to This Policy</h2>
            <p className="text-slate-300 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
              Your continued use of the service after changes are posted constitutes acceptance of
              the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-amber-500">13. Contact Us</h2>
            <p className="text-slate-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <span className="text-amber-500 font-semibold">support@rusuite.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
