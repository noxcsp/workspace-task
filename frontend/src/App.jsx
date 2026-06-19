import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel, FieldSet, FieldLegend } from "@/components/ui/field"
import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="flex flex-col items-center pt-10">
      <FieldSet className="w-full max-w-sm">
        <FieldLegend>
          Add Task
        </FieldLegend>
        <FieldGroup >
          <Field>
            <FieldLabel htmlFor="taskname">Task Name</FieldLabel>
            <Input id="taskname" placeholder="" />
          </Field>
          <Field>
            <FieldLabel htmlFor="taskdescription">Task Description</FieldLabel>
            <Input
              id="taskdescription"
              placeholder=""
            />
          </Field>
          <Field orientation="horizontal">
            <Button type="reset" variant="outline">
              Reset
            </Button>
            <Button type="submit">Submit</Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}

export default App
