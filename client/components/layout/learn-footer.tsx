export const LearnFooter = () => {
  return (
    <div className="bg-gray-800 border-t">
      <div className="max-w-5xl mx-auto px-6 py-10 text-sm text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-2">Company</h4>
            <p>About</p>
            <p>Careers</p>
            <p>Contact</p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Resources</h4>
            <p>Help Center</p>
            <p>Terms</p>
            <p>Privacy</p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Courses</h4>
            <p>Development</p>
            <p>Design</p>
            <p>Marketing</p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Follow</h4>
            <p>Twitter</p>
            <p>LinkedIn</p>
            <p>YouTube</p>
          </div>
        </div>

        <div className="mt-8 border-t pt-4 text-xs text-gray-400">
          © {new Date().getFullYear()} Unitus. All rights reserved.
        </div>
      </div>
    </div>
  );
};
