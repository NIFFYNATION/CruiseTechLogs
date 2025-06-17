import React, { useState } from "react";
import InputField from "../../common/InputField";
import { Button } from "../../common/Button";

const CreateApiKeyModal = ({ onClose, onSubmit }) => {
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-10">
      <div className="mb-8">
        <label className="block text-lg font-semibold mb-4" htmlFor="api-password">
          Enter Account Password
        </label>
        <InputField
          id="api-password"
          name="api-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showToggle={true}
          onToggle={() => setIsPasswordVisible(!isPasswordVisible)}
          isToggled={isPasswordVisible}
          className="py-5 px-6 text-lg rounded-xl"
        />
      </div>
      <Button
        type="submit"
        variant="quaternary"
        size="lg"
        shape="rounded"
        className="w-fit"
      >
        Generate API Key
      </Button>
    </form>
  );
};

export default CreateApiKeyModal;
