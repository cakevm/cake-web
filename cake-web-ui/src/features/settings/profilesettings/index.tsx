import { useDispatch } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { showNotification } from "../../common/headerSlice";
import InputText from "../../../components/Input/InputText";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import ToogleInput from "../../../components/Input/ToogleInput";

function ProfileSettings() {
  const dispatch = useDispatch();

  // Call API to update profile settings changes
  const updateProfile = () => {
    dispatch(showNotification({ message: "Profile Updated", status: 1 }));
  };

  const updateFormValue = ({ updateType, value }) => {
    console.log(updateType);
  };

  return (
    <>
      <TitleCard title="Profile Settings" topMargin="mt-2" TopSideButtons={undefined}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <InputText
            labelTitle="Name"
            defaultValue="Alex"
            updateFormValue={updateFormValue}
            updateType="name"
          />
          <InputText
            labelTitle="Email Id"
            defaultValue="alex@dashwind.com"
            updateFormValue={updateFormValue}
            updateType="emailid"
          />
          <InputText
            labelTitle="Title"
            defaultValue="UI/UX Designer"
            updateFormValue={updateFormValue}
            updateType="title"
          />
          <InputText
            labelTitle="Place"
            defaultValue="California"
            updateFormValue={updateFormValue}
            updateType="place"
          />
          <TextAreaInput
              labelTitle="About"
              defaultValue="Doing what I love, part time traveller"
              updateFormValue={updateFormValue}
              updateType="about" labelStyle={undefined} type={undefined} containerStyle={undefined}
              placeholder={undefined}
          />
        </div>
        <div className="divider"></div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <InputText
              labelTitle="Language"
              defaultValue="English"
              updateFormValue={updateFormValue}
              updateType="language"
          />
          <InputText
            labelTitle="Timezone"
            defaultValue="IST"
            updateFormValue={updateFormValue}
            updateType="timezone"
          />
          <ToogleInput
              updateType="syncData"
              labelTitle="Sync Data"
              defaultValue={true}
              updateFormValue={updateFormValue} labelStyle={undefined} type={undefined} containerStyle={undefined}
              placeholder={undefined}          />
        </div>

        <div className="mt-16">
          <button
            className="btn btn-primary float-right"
            onClick={() => updateProfile()}
          >
            Update
          </button>
        </div>
      </TitleCard>
    </>
  );
}

export default ProfileSettings;
