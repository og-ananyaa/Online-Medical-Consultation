import React, { useState,useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BASE_URL } from "../../helper.js";
import app from "../../firebase.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const EditForm = () => {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [domain, setDomain] = useState("");
  const [experience, setExperience] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [location, setLocation] = useState("");
  const [hours, setHours] = useState("");
  const [profilePic, setprofilePic]=useState("");
  const router = useRouter();
  const email = router.query.email;

  useEffect(() => {
    if (!email) return; // Prevent fetching if email is not available
  
    const fetchDoctorData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/search/${email}`);
        if (!response.ok) throw new Error("Failed to fetch doctor details");
  
        const data = await response.json();
        
        // Populate state with fetched data
        setName(data.name || "");
        setAge(data.age || "");
        setDomain(data.domain || "");
        setExperience(data.experience || "");
        setQualifications(data.qualifications || "");
        setLocation(data.location || "");
        setHours(data.hours || "");
        setprofilePic(data.profilePic || "");
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };
  
    fetchDoctorData();
  }, [email]); // Runs when email changes

  const updateDoctor=async(e)=>{


  const image=profilePic;
  if(!image)
  {
    fetch(`${BASE_URL}/update/${email}`, {
            method: "POST",
            body: JSON.stringify({
              email: email,
                name: name||undefined,
                age: age||undefined,
                domain: domain||undefined,
                experience: experience||undefined,
                qualifications: qualifications||undefined,
                location: location||undefined,
                hours: hours||undefined,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((data) => {
              alert("Update profile");
               router.push(`/findDoctor/${email}`);
              console.log(data);
            })
            .catch((error) => {
              console.log(error);
            });
  }
  else{
  const fileName = new Date().getTime() + image.name;
      const storage = getStorage(app);
      const StorageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(StorageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.group(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            fetch(`${BASE_URL}/update/${email}`, {
              method: "POST",
              body: JSON.stringify({
                email: email,
                name: name||undefined,
                age: age||undefined,
                domain: domain||undefined,
                experience: experience||undefined,
                qualifications: qualifications||undefined,
                location: location||undefined,
                hours: hours||undefined,
                picturePath: downloadURL,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((res) => res.json())
              .then((data) => {
                alert("Updated profile");
                 router.push(`/findDoctor/${email}`);
                console.log(data);
              })
              .catch((error) => {
                alert("Error");
                console.log(error);
              });
          });
        }
      );
    }
  };


  return (
    <div className="bg-white">
      <div className="flex items-center justify-center">
      <div className=" bg-white px-16 py-10 border-2 w-1/2 mt-24 mb-24">
        <div className="font-semibold text-black flex justify-center items-center mb-6 text-lg">Edit your Profile</div>
        <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">Name: </label>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => {
            setName(e.target.value);
          }}
          type="text"
          value={name}
          name="name"
          style={{ color: "black" }}
        />
        </div>
        <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">Age: </label>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => {
            setAge(e.target.value);
          }}
          type="number"
          name="age"
          value={age}
          style={{ color: "black" }}
        />
        </div>
        <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">Domain: </label>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => {
            setDomain(e.target.value);
          }}
          type="text"
          value={domain}
          name="domain"
          style={{ color: "black" }}
        />
       </div>
        <label className="block mb-2 text-sm font-medium text-gray-900">Experience: </label>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => {
            setExperience(e.target.value);
          }}
          type="number"
          value={experience}
          name="experience"
          style={{ color: "black" }}
        />
        <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">Qualifications: </label>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => {
            setQualifications(e.target.value);
          }}
          type="text"
          value={qualifications}
          name="qualifications"
          style={{ color: "black" }}
        />
        </div>
        <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">Location: </label>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => {
            setLocation(e.target.value);
          }}
          type="text"
          value={location}
          name="location"
          style={{ color: "black" }}
        />
        </div>
        <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">Available Hours: </label>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => {
            setHours(e.target.value);
          }}
          type="text"
          value={hours}
          name="hours"
          style={{ color: "black" }}
        />
        </div>
        <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Profile Picture:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setprofilePic(e.target.files[0])}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          {profilePic && (
          <div className="mb-6 flex justify-center">
            <img
              src={typeof profilePic === "string" ? profilePic : URL.createObjectURL(profilePic)}
              alt="Profile Preview"
              className="w-32 h-32 object-cover"
            />
          </div>
        )}

        <div className="mb-6 flex items-center justify-center">
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          onClick={(e) => {
            updateDoctor(e);
          }}
          // style={{ backgroundColor: "white", color: "black" }}
        >
          Submit
        </button>
        </div>
      <div className="flex items-center justify-center">
      <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
        <Link href={`/findDoctor/${session?.user.email}`}>Show Profile</Link>
      </button>
      </div>
      </div>
      </div>
    </div>
  );
};

export default EditForm;
