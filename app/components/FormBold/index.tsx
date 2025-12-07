import React from 'react'

// tailwind spinner component
const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
}


const FormBold = () => {
  // email input state
  const [email, setEmail] = React.useState('')
  // name input state
  const [name, setName] = React.useState('')
  // spinner
  const [isSpinnerVisible, setIsSpinnerVisible] = React.useState(false);

  return (
    <div>
      <link rel="stylesheet" href="https://cdn.formbold.com/formbold.css" />
      <br />
      <div className="formbold-builder-form themeOne">
        <form
          encType="multipart/form-data"
          action="https://formbold.com/s/9RmJM"
          method="POST"
          className="mx-auto w-full rounded-[10px] border border-stroke bg-white p-10 themeOne"
        >
          <div className="SortableItem fb-builder-item">
            <h3
              className="static font-bold text-xl leading-tight text-black sm:text-[28px]"
            >
              Leave a message
            </h3>
          </div>
          <div className="SortableItem fb-builder-item">
            <div className="mb-4">
              <label className="mb-2.5 block text-base text-black">
                <span>Name</span>
              </label>
              <input
                type="text"
                className="w-full rounded border border-stroke bg-white px-5 py-3 text-base text-black outline-none focus:border-primary"
                name="text_input_B1CE16F6-08E3-483D-B6A2-378FEBF5D7D2"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-ddg-inputtype="identities.fullName"
              />
            </div>
          </div>
          <div className="SortableItem fb-builder-item">
            <div className="mb-4">
              <label className="mb-2.5 block text-base text-black">
                <span>E-Mail</span>
              </label>
              <input
                type="email"
                className="w-full rounded border border-stroke bg-white px-5 py-3 text-base text-black outline-none focus:border-primary"
                name="email_input_12E6E160-9152-46DE-BDCF-765DA6CDE00D"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  backgroundSize: "auto 24px !important",
                  backgroundPosition: "right center !important",
                  backgroundRepeat: "no-repeat !important",
                  backgroundOrigin: "content-box !important",
                  backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0ibm9uZSIgdmlld0JveD0iMCAwIDEyOCAxMjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Im02NCAxMjhjMzUuMzQ2IDAgNjQtMjguNjU0IDY0LTY0cy0yOC42NTQtNjQtNjQtNjQtNjQgMjguNjU0LTY0IDY0IDI4LjY1NCA2NCA2NCA2NHoiIGZpbGw9IiNkZTU4MzMiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgogICAgPHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJtNzMgMTExLjc1YzAtLjUuMTIzLS42MTQtMS40NjYtMy43ODItNC4yMjQtOC40NTktOC40Ny0yMC4zODQtNi41NC0yOC4wNzUuMzUzLTEuMzk3LTMuOTc4LTUxLjc0NC03LjA0LTUzLjM2NS0zLjQwMi0xLjgxMy03LjU4OC00LjY5LTExLjQxOC01LjMzLTEuOTQzLS4zMS00LjQ5LS4xNjQtNi40ODIuMTA1LS4zNTMuMDQ3LS4zNjguNjgzLS4wMy43OTggMS4zMDguNDQzIDIuODk1IDEuMjEyIDMuODMgMi4zNzUuMTc4LjIyLS4wNi41NjYtLjM0Mi41NzctLjg4Mi4wMzItMi40ODIuNDAyLTQuNTkzIDIuMTk1LS4yNDQuMjA3LS4wNDEuNTkyLjI3My41MyA0LjUzNi0uODk3IDkuMTctLjQ1NSAxMS45IDIuMDI3LjE3Ny4xNi4wODQuNDUtLjE0Ny41MTItMjMuNjk0IDYuNDQtMTkuMDAzIDI3LjA1LTEyLjY5NiA1Mi4zNDQgNS42MTkgMjIuNTMgNy43MzMgMjkuNzkyIDguNCAzMi4wMDRhLjcxOC43MTggMCAwIDAgLjQyMy40NjdjOC4xNTYgMy4yNDggMjUuOTI4IDMuMzkyIDI1LjkyOC0yLjEzMnoiIGZpbGw9IiNkZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgogICAgPHBhdGggZD0ibTc2LjI1IDExNi41Yy0yLjg3NSAxLjEyNS04LjUgMS42MjUtMTEuNzUgMS42MjUtNC43NjQgMC0xMS42MjUtLjc1LTE0LjEyNS0xLjg3NS0xLjU0NC00Ljc1MS02LjE2NC0xOS40OC0xMC43MjctMzguMTg1bC0uNDQ3LTEuODI3LS4wMDQtLjAxNWMtNS40MjQtMjIuMTU3LTkuODU1LTQwLjI1MyAxNC40MjctNDUuOTM4LjIyMi0uMDUyLjMzLS4zMTcuMTg0LS40OTItMi43ODYtMy4zMDUtOC4wMDUtNC4zODgtMTQuNjA1LTIuMTExLS4yNy4wOTMtLjUwNi0uMTgtLjMzNy0uNDEyIDEuMjk0LTEuNzgzIDMuODIzLTMuMTU1IDUuMDcxLTMuNzU2LjI1OC0uMTI0LjI0Mi0uNTAyLS4wMy0uNTg4YTI3Ljg3NyAyNy44NzcgMCAwIDAgLTMuNzcyLS45Yy0uMzctLjA1OS0uNDAzLS42OTMtLjAzMi0uNzQzIDkuMzU2LTEuMjU5IDE5LjEyNSAxLjU1IDI0LjAyOCA3LjcyNmEuMzI2LjMyNiAwIDAgMCAuMTg2LjExNGMxNy45NTIgMy44NTYgMTkuMjM4IDMyLjIzNSAxNy4xNyAzMy41MjgtLjQwOC4yNTUtMS43MTUuMTA4LTMuNDM4LS4wODUtNi45ODYtLjc4MS0yMC44MTgtMi4zMjktOS40MDIgMTguOTQ4LjExMy4yMS0uMDM2LjQ4OC0uMjcyLjUyNS02LjQzOCAxIDEuODEyIDIxLjE3MyA3Ljg3NSAzNC40NjF6IiBmaWxsPSIjZmZmIi8+CiAgICA8cGF0aCBkPSJtODQuMjggOTAuNjk4Yy0xLjM2Ny0uNjMzLTYuNjIxIDMuMTM1LTEwLjExIDYuMDI4LS43MjgtMS4wMzEtMi4xMDMtMS43OC01LjIwMy0xLjI0Mi0yLjcxMy40NzItNC4yMTEgMS4xMjYtNC44OCAyLjI1NC00LjI4My0xLjYyMy0xMS40ODgtNC4xMy0xMy4yMjktMS43MS0xLjkwMiAyLjY0Ni40NzYgMTUuMTYxIDMuMDAzIDE2Ljc4NiAxLjMyLjg0OSA3LjYzLTMuMjA4IDEwLjkyNi02LjAwNS41MzIuNzQ5IDEuMzg4IDEuMTc4IDMuMTQ4IDEuMTM3IDIuNjYyLS4wNjIgNi45NzktLjY4MSA3LjY0OS0xLjkyMS4wNC0uMDc1LjA3NS0uMTY0LjEwNS0uMjY2IDMuMzg4IDEuMjY2IDkuMzUgMi42MDYgMTAuNjgyIDIuNDA2IDMuNDctLjUyMS0uNDg0LTE2LjcyMy0yLjA5LTE3LjQ2N3oiIGZpbGw9IiMzY2E4MmIiLz4KICAgIDxwYXRoIGQ9Im03NC40OSA5Ny4wOTdjLjE0NC4yNTYuMjYuNTI2LjM1OC44LjQ4MyAxLjM1MiAxLjI3IDUuNjQ4LjY3NCA2LjcwOS0uNTk1IDEuMDYyLTQuNDU5IDEuNTc0LTYuODQzIDEuNjE1cy0yLjkyLS44MzEtMy40MDMtMi4xODFjLS4zODctMS4wODEtLjU3Ny0zLjYyMS0uNTcyLTUuMDc1LS4wOTgtMi4xNTguNjktMi45MTYgNC4zMzQtMy41MDYgMi42OTYtLjQzNiA0LjEyMS4wNzEgNC45NDQuOTQgMy44MjgtMi44NTcgMTAuMjE1LTYuODg5IDEwLjgzOC02LjE1MiAzLjEwNiAzLjY3NCAzLjQ5OSAxMi40MiAyLjgyNiAxNS45MzktLjIyIDEuMTUxLTEwLjUwNS0xLjEzOS0xMC41MDUtMi4zOCAwLTUuMTUyLTEuMzM3LTYuNTY1LTIuNjUtNi43MXptLTIyLjUzLTEuNjA5Yy44NDMtMS4zMzMgNy42NzQuMzI1IDExLjQyNCAxLjk5MyAwIDAtLjc3IDMuNDkxLjQ1NiA3LjYwNC4zNTkgMS4yMDMtOC42MjcgNi41NTgtOS44IDUuNjM3LTEuMzU1LTEuMDY1LTMuODUtMTIuNDMyLTIuMDgtMTUuMjM0eiIgZmlsbD0iIzRjYmEzYyIvPgogICAgPHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJtNTUuMjY5IDY4LjQwNmMuNTUzLTIuNDAzIDMuMTI3LTYuOTMyIDEyLjMyMS02LjgyMiA0LjY0OC0uMDE5IDEwLjQyMi0uMDAyIDE0LjI1LS40MzZhNTEuMzEyIDUxLjMxMiAwIDAgMCAxMi43MjYtMy4wOTVjMy45OC0xLjUxOSA1LjM5Mi0xLjE4IDUuODg3LS4yNzIuNTQ0Ljk5OS0uMDk3IDIuNzIyLTEuNDg4IDQuMzA5LTIuNjU2IDMuMDMtNy40MzEgNS4zOC0xNS44NjUgNi4wNzYtOC40MzMuNjk4LTE0LjAyLTEuNTY1LTE2LjQyNSAyLjExOC0xLjAzOCAxLjU4OS0uMjM2IDUuMzMzIDcuOTIgNi41MTIgMTEuMDIgMS41OSAyMC4wNzItMS45MTcgMjEuMTkuMjAxIDEuMTE5IDIuMTE4LTUuMzIzIDYuNDI4LTE2LjM2MiA2LjUxOHMtMTcuOTM0LTMuODY1LTIwLjM3OS01LjgzYy0zLjEwMi0yLjQ5NS00LjQ5LTYuMTMzLTMuNzc1LTkuMjc5eiIgZmlsbD0iI2ZjMyIgZmlsbC1ydWxlPSJldmVub2RkIi8+CiAgICA8ZyBmaWxsPSIjMTQzMDdlIiBvcGFjaXR5PSIuOCI+CiAgICAgIDxwYXRoIGQ9Im02OS4zMjcgNDIuMTI3Yy42MTYtMS4wMDggMS45ODEtMS43ODYgNC4yMTYtMS43ODYgMi4yMzQgMCAzLjI4NS44ODkgNC4wMTMgMS44OC4xNDguMjAyLS4wNzYuNDQtLjMwNi4zNGE1OS44NjkgNTkuODY5IDAgMCAxIC0uMTY4LS4wNzNjLS44MTctLjM1Ny0xLjgyLS43OTUtMy41NC0uODItMS44MzgtLjAyNi0yLjk5Ny40MzUtMy43MjcuODMxLS4yNDYuMTM0LS42MzQtLjEzMy0uNDg4LS4zNzJ6bS0yNS4xNTcgMS4yOWMyLjE3LS45MDcgMy44NzYtLjc5IDUuMDgxLS41MDQuMjU0LjA2LjQzLS4yMTMuMjI3LS4zNzctLjkzNS0uNzU1LTMuMDMtMS42OTItNS43Ni0uNjc0LTIuNDM3LjkwOS0zLjU4NSAyLjc5Ni0zLjU5MiA0LjAzOC0uMDAyLjI5Mi42LjMxNy43NTYuMDcuNDItLjY3IDEuMTItMS42NDYgMy4yODktMi41NTN6Ii8+CiAgICAgIDxwYXRoIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0ibTc1LjQ0IDU1LjkyYTMuNDcgMy40NyAwIDAgMSAtMy40NzQtMy40NjIgMy40NyAzLjQ3IDAgMCAxIDMuNDc1LTMuNDYgMy40NyAzLjQ3IDAgMCAxIDMuNDc0IDMuNDYgMy40NyAzLjQ3IDAgMCAxIC0zLjQ3NSAzLjQ2MnptMi40NDctNC42MDhhLjg5OS44OTkgMCAwIDAgLTEuNzk5IDBjMCAuNDk0LjQwNS44OTUuOS44OTUuNDk5IDAgLjktLjQuOS0uODk1em0tMjUuNDY0IDMuNTQyYTQuMDQyIDQuMDQyIDAgMCAxIC00LjA0OSA0LjAzNyA0LjA0NSA0LjA0NSAwIDAgMSAtNC4wNS00LjAzNyA0LjA0NSA0LjA0NSAwIDAgMSA0LjA1LTQuMDM3IDQuMDQ1IDQuMDQ1IDAgMCAxIDQuMDUgNC4wMzd6bS0xLjE5My0xLjMzOGExLjA1IDEuMDUgMCAwIDAgLTIuMDk3IDAgMS4wNDggMS4wNDggMCAwIDAgMi4wOTcgMHoiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgogICAgPC9nPgogICAgPHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJtNjQgMTE3Ljc1YzI5LjY4NSAwIDUzLjc1LTI0LjA2NSA1My43NS01My43NXMtMjQuMDY1LTUzLjc1LTUzLjc1LTUzLjc1LTUzLjc1IDI0LjA2NS01My43NSA1My43NSAyNC4wNjUgNTMuNzUgNTMuNzUgNTMuNzV6bTAgNWMzMi40NDcgMCA1OC43NS0yNi4zMDMgNTguNzUtNTguNzVzLTI2LjMwMy01OC43NS01OC43NS01OC43NS01OC43NSAyNi4zMDMtNTguNzUgNTguNzUgMjYuMzAzIDU4Ljc1IDU4Ljc1IDU4Ljc1eiIgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIi8+Cjwvc3ZnPg==") !important',
                  transition: "background 0s ease 0s !important"
                }}
                data-ddg-inputtype="identities.emailAddress"
                data-ddg-autofill="true"
              />
            </div>
          </div>
          <div className="SortableItem fb-builder-item">
            <div className="mb-4">
              <label className="mb-2.5 block text-base text-black">
                <span>Message</span>
              </label>
              <textarea
                className="w-full rounded border border-stroke bg-white px-5 py-3 text-base text-black outline-none focus:border-primary"
                name="text_area_223AE58C-584E-42D4-B0EB-EB4687DCF7AD"
                placeholder="Tell us what do you think"
              />
            </div>
          </div>
          <div className="btn-toolbar flex items-center space-x-3">
            <input
              type="submit"
              className="inline-flex cursor-pointer items-center justify-center rounded border border-primary bg-primary px-8 py-2 text-base font-medium text-white hover:bg-opacity-90"
              value="Submit"
              onClick={(e) => {
                // set spinner visible
                setIsSpinnerVisible(true);
              }}
            />
            {isSpinnerVisible && <Spinner />}
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormBold
