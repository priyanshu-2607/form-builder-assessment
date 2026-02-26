import { useListFormsQuery } from "../store/api/formsApi.js";

export function useFormsList() {
  const { data, isLoading, error } = useListFormsQuery();

  return {
    forms: Array.isArray(data) ? data : [],
    loading: isLoading,
    error: error ? "Failed to load forms." : ""
  };
}
