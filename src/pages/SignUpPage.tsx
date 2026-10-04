import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { initialFormData, type SignUpFormData } from "../types/SignUpFormData";

type Errors = Partial<Record<keyof SignUpFormData, string>>;

const CLUBS = ["Chess Club", "Robotics Club", "Drama Club", "Music Club", "Basketball Club"];

const COURSES = ["BS Computer Science", "BS Information Technology", "BS Business Administration", "BS Accountancy", "BS Nursing"];
const SECTIONS = ["101", "102", "103", "201", "202", "203", "301", "302", "401"];

function validateShow1(data: SignUpFormData): Errors {
  const errors: Errors = {};
  if (!data.username.trim()) errors.username = "Username is required.";
  if (!data.email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Invalid email.";
  if (!data.password) errors.password = "Password is required.";
  else if (data.password.length < 8) errors.password = "Min. 8 characters.";
  if (data.confirmPassword !== data.password) errors.confirmPassword = "Passwords do not match.";
  return errors;
}

function validateShow2(data: SignUpFormData): Errors {
  const errors: Errors = {};
  if (!data.firstName.trim()) errors.firstName = "First name is required.";
  if (!data.lastName.trim()) errors.lastName = "Last name is required.";
  if (!data.gender) errors.gender = "Please select a gender.";
  if (!data.birthday) errors.birthday = "Birthday is required.";
  if (!data.course) errors.course = "Please select a course.";
  if (!data.section) errors.section = "Please select a section.";
  if (!data.club) errors.club = "Please select a club.";
  return errors;
}

function SignUpPage() {
  const [show, setShow] = useState<1 | 2>(1); // which of the two screens is visible
  const [formData, setFormData] = useState<SignUpFormData>(initialFormData);
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleNext() {
    const show1Errors = validateShow1(formData);
    setErrors(show1Errors);
    if (Object.keys(show1Errors).length === 0) setShow(2);
  }

  function handleBack() {
    setShow(1);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const show2Errors = validateShow2(formData);
    setErrors(show2Errors);
    if (Object.keys(show2Errors).length > 0) return;

    setIsLoading(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Could not save your registration.");
      }
      setUser(formData); // save to Context so WelcomePage can read it
      navigate("/welcome");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleClear() {
    setFormData(initialFormData);
    setErrors({});
    setSubmitError("");
    setShow(1);
  }

  return (
    <div className="page">
      <div className="card">
        <p className="step-label">Show {show} of 2</p>

        {show === 1 && (
          <div>
            <h2>Account Credentials</h2>
            <label>Username</label>
            <input name="username" value={formData.username} onChange={handleChange} />
            {errors.username && <p className="error">{errors.username}</p>}

            <label>Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} />
            {errors.email && <p className="error">{errors.email}</p>}

            <label>Password</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} />
            {errors.password && <p className="error">{errors.password}</p>}

            <label>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

            <div className="actions">
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        )}

        {show === 2 && (
          <form onSubmit={handleSubmit}>
            <h2>Personal Information</h2>
            <label>First Name</label>
            <input name="firstName" value={formData.firstName} onChange={handleChange} />
            {errors.firstName && <p className="error">{errors.firstName}</p>}

            <label>Last Name</label>
            <input name="lastName" value={formData.lastName} onChange={handleChange} />
            {errors.lastName && <p className="error">{errors.lastName}</p>}

            <label>Middle Initial</label>
            <input name="middleInitial" maxLength={2} value={formData.middleInitial} onChange={handleChange} />

            <label>Gender</label>
            <div className="radio-group">
              {["Male", "Female", "Prefer not to say"].map((option) => (
                <label key={option} className="radio-option">
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={formData.gender === option}
                    onChange={handleChange}
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors.gender && <p className="error">{errors.gender}</p>}

            <label>Birthday</label>
            <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} />
            {errors.birthday && <p className="error">{errors.birthday}</p>}

            <label>Course</label>
            <select name="course" value={formData.course} onChange={handleChange}>
              <option value="">Select a course…</option>
              {COURSES.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
            {errors.course && <p className="error">{errors.course}</p>}

            <label>Section</label>
            <select name="section" value={formData.section} onChange={handleChange}>
              <option value="">Select a section…</option>
              {SECTIONS.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
            {errors.section && <p className="error">{errors.section}</p>}

            <label>Club</label>
            <select name="club" value={formData.club} onChange={handleChange}>
              <option value="">Select a club…</option>
              {CLUBS.map((club) => (
                <option key={club} value={club}>
                  {club}
                </option>
              ))}
            </select>
            {errors.club && <p className="error">{errors.club}</p>}

            {submitError && <p className="error">{submitError}</p>}

            <div className="actions actions-spread">
              <button type="button" className="btn btn-secondary" onClick={handleBack}>
                Back
              </button>
              <div className="actions">
                <button type="button" className="btn btn-danger" onClick={handleClear}>
                  Clear
                </button>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? "Saving…" : "Submit"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default SignUpPage;
