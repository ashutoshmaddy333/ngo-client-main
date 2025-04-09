function TermCond() {
  return (
    <>
      <label htmlFor="my_modal_7" className="text-lightOrange ml-1 cursor-pointer hover:underline font-semibold">
        Terms and Conditions
      </label>
      <input type="checkbox" value ="true" id="my_modal_7" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Terms and Conditions</h3>
          <p className="py-4">
            These terms and conditions govern your use of the Freecosystem website. By accessing or using Freecosystem,
            you agree to be bound by these terms. Freecosystem is an online platform designed to provide information and
            resources. It does not facilitate the buying or selling of goods or services. Freecosystem is not
            responsible for the accuracy of information, third-party content, mishaps or losses, or delivery of goods or
            services. You agree to use Freecosystema lawfully, respectfully, and responsibly. All content on
            Freecosystem is protected by copyright laws. We may update these terms and conditions from time to time.
            These terms and conditions shall be governed by and construed in accordance with the laws of India. If you
            have any questions or concerns, please contact us at support@freecosystem.com. By using Freecosystem, you
            acknowledge and agree to these terms and conditions.
          </p>
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_7">
          Close
        </label>
      </div>
    </>
  )
}

export default TermCond

