import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { handleRegister } from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import "./Register.scss";

export default function Register() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const [imagePreview, setImagePreview] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const uploadData = new FormData();

    if (data.file && data.file[0]) {
      uploadData.append("file", data.file[0]);
    } else {
      setErrorMessage("Profile picture is required");
      return;
    }

    uploadData.append("name", data.Name?.trim() || "");
    uploadData.append("email", data.Email?.trim() || "");
    uploadData.append("password", data.Password?.trim() || "");
    uploadData.append("role", data.Role || "");
    uploadData.append("overview", data.overview?.trim() || "");

    try {
      const response = await handleRegister(uploadData);
      console.log("Registration successful:", response);
      navigate("/login");
    } catch (error) {
      console.error(
        "Error during registration:",
        error.response || error.message
      );
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form className="register" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="register__title">Sign Up</h2>
      <h3 className="register__subtitle">
        Welcome to DNH! Please enter your details:
      </h3>

      {errorMessage && <p className="register__error">{errorMessage}</p>}

      <label className="register__label" htmlFor="name">
        <h3 className="register__name">Name:</h3>
        <input
          id="name"
          className={`register__input ${errors.Name ? "error" : ""}`}
          {...register("Name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
          placeholder="Enter your name"
        />
      </label>
      {errors.Name && <p className="register__error">{errors.Name.message}</p>}

      <label className="register__label" htmlFor="email">
        <h3 className="register__name"> Email:</h3>
        <input
          id="email"
          className={`register__input ${errors.Email ? "error" : ""}`}
          {...register("Email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Enter a valid email address",
            },
          })}
          type="email"
          placeholder="Enter your email"
        />
      </label>
      {errors.Email && (
        <p className="register__error">{errors.Email.message}</p>
      )}

      <label className="register__label" htmlFor="password">
        <h3 className="register__name"> Password</h3>
        <input
          id="password"
          className={`register__input ${errors.Password ? "error" : ""}`}
          {...register("Password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          type="password"
          placeholder="Password"
        />
      </label>
      {errors.Password && (
        <p className="register__error">{errors.Password.message}</p>
      )}

      <label className="register__label" htmlFor="role">
        <h3 className="register__name"> Role</h3>
        <select
          id="role"
          className={`register__input--select ${errors.Role ? "error" : ""}`}
          {...register("Role", { required: "Role is required" })}
        >
          <option value="">Select your role</option>
          <option value="dentist">Dentist</option>
          <option value="mentor">Mentor</option>
        </select>
      </label>
      {errors.Role && <p className="register__error">{errors.Role.message}</p>}

      <label className="register__label" htmlFor="overview">
        <h3 className="register__name">Overview</h3>
        <textarea
          id="overview"
          className={`register__input register__input--textarea ${
            errors.overview ? "error" : ""
          }`}
          {...register("overview", {
            maxLength: {
              value: 200,
              message: "Overview cannot exceed 1000 characters",
            },
          })}
          placeholder="Describe yourself"
          rows="4"
        />
      </label>
      {errors.overview && (
        <p className="register__error">{errors.overview.message}</p>
      )}
      <div className="register__file">
        <label className="register__label register__label--img" htmlFor="file">
          <h3 className="register__name">Upload Profile picture:</h3>
          <Controller
            name="file"
            control={control}
            rules={{
              required: "Profile picture is required",
            }}
            defaultValue={[]}
            render={({ field }) => (
              <>
                <label htmlFor="file" className="register__upload">
                  Upload
                </label>
                <input
                  id="file"
                  className={`register__input ${errors.file ? "error" : ""}`}
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    field.onChange(e.target.files);
                    handleImageChange(e);
                  }}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
              </>
            )}
          />
        </label>
        {errors.file && (
          <p className="register__error">{errors.file.message}</p>
        )}

        <div className="register__img">
          {imagePreview && (
            <img
              className="register__prev"
              src={imagePreview}
              alt="Preview"
              style={{ width: "100px", height: "100px" }}
            />
          )}
        </div>
      </div>

      <button className="register__submit" type="submit">
        Submit
      </button>
    </form>
  );
}
