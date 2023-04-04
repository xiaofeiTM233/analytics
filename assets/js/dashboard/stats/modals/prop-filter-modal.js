import React, { useState } from 'react'
import { withRouter } from "react-router-dom";

import Combobox from '../../components/combobox'
import FilterTypeSelector from "../../components/filter-type-selector";
import { FILTER_TYPES } from "../../util/filters";
import { parseQuery } from '../../query'
import * as api from '../../api'
import { apiPath } from '../../util/url'

function PropFilterModal(props) {
  const query = parseQuery(props.location.search, props.site)
  const [formState, setFormState] = useState(getFormState())

  function getFormState() {
    return {
      prop_key: null,
      prop_value: { type: FILTER_TYPES.is, clauses: [] }
    }
  }

  function fetchOptions(filter) {
    return (input) => {
      if (filter === 'prop_key') {
        return api.get(apiPath(props.site, `/suggestions/${filter}`), query, { q: input.trim() })
      } else {
        const propKey = formState.prop_key?.value
        const updatedQuery = { ...query, filters: { ...query.filters, props: {[propKey]: '!(none)'} } }
        return api.get(apiPath(props.site, `/suggestions/${filter}`), updatedQuery, { q: input.trim() })
      }
    }
  }

  function onPropKeySelect() {
    return (selectedOptions) => {
      const newPropKey = selectedOptions.length === 0 ? null : selectedOptions[0]
      setFormState(prevState => ({
        prop_key: newPropKey,
        prop_value: { type: prevState.prop_value.type, clauses: [] }
      }))
    }
  }

  function onPropValueSelect() {
    return (selection) => {
      setFormState(prevState => ({
        ...prevState, prop_value: { ...prevState.prop_value, clauses: selection }
      }))
    }
  }

  function onFilterTypeSelect() {
    return (newType) => {
      setFormState(prevState => ({
        ...prevState, prop_value: { ...prevState.prop_value, type: newType }
      }))
    }
  }

  function selectedFilterType() {
    return formState.prop_value.type
  }

  function renderFilterInputs() {
    return (
      <div className="flex items-start mt-6">
        <Combobox className="mr-2" fetchOptions={fetchOptions('prop_key')} singleOption={true} values={formState.prop_key ? [formState.prop_key] : []} onSelect={onPropKeySelect()} placeholder={'Property'} />
        <FilterTypeSelector isDisabled={!formState.prop_key} forFilter={'prop_value'} onSelect={onFilterTypeSelect()} selectedType={selectedFilterType()} />
        <Combobox isDisabled={!formState.prop_key} fetchOptions={fetchOptions('prop_value')} values={formState.prop_value.clauses} onSelect={onPropValueSelect()} placeholder={'Value'} />
      </div>
    )
  }

  function isDisabled() {
    return false
  }

  function shouldShowClear() {
    return true
  }

  return (
    <>
      <h1 className="text-xl font-bold dark:text-gray-100">Filter by Property</h1>

      <div className="mt-4 border-b border-gray-300"></div>
      <main className="modal__content">
        <form className="flex flex-col" onSubmit={() => { }}>
          {renderFilterInputs()}

          <div className="mt-6 flex items-center justify-start">
            <button
              type="submit"
              className="button"
              disabled={isDisabled()}
            >
              Apply Filter
            </button>

            {shouldShowClear() && (
              <button
                type="button"
                className="ml-2 button px-4 flex bg-red-500 dark:bg-red-500 hover:bg-red-600 dark:hover:bg-red-700 items-center"
                onClick={() => { }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                Remove filter
              </button>
            )}
          </div>
        </form>
      </main>
    </>
  )
}

export default withRouter(PropFilterModal)