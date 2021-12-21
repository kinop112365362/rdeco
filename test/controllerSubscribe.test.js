/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, create } from '../src'

test('测试多实例下, data-table 对 row 进行单选控制', async () => {
  const Row = createComponent({
    name: '@test/row',
    state: {
      value: '',
      selected: 'false',
    },
    exports: {
      select(selected) {
        this.setter.selected(selected)
      },
    },
    subscribe: {
      ['@test/data-table']: {
        state: {
          currentSelectRowId() {},
        },
      },
    },
    controller: {
      onChange(e) {
        this.setter.value(e.target.value)
      },
      onClick() {
        this.invoke(['@test/data-table'], 'selectRow', this.props.id)
        this.setter.selected('true')
      },
    },
    view: {
      render() {
        return (
          <div
            role={`${this.props.id}`}
            onClick={(e) => this.controller.onClick()}
          >
            <input
              type="text"
              onChange={this.controller.onChange}
              value={this.state.value}
            />
            <div role={`selected_${this.props.id}`}>{this.state.selected}</div>
          </div>
        )
      },
    },
  })
  function createMap(max) {
    const map = []
    for (let index = 0; index < max; index++) {
      map.push(index)
    }
    return map
  }
  const DataTable = createComponent({
    name: '@test/data-table',
    state: {
      currentSelectRowId: null,
      dataSource: createMap(5),
    },
    exports: {
      selectRow(id) {
        if (this.state.currentSelectRowId !== null) {
          this.invoke(
            ['@test/row', ({ channel }) => channel === 'data-row'],
            'select',
            'false'
          )
        }
        this.setter.currentSelectRowId(id)
      },
    },
    view: {
      render() {
        return (
          <>
            <div role="currentSelectRowId">{this.state.currentSelectRowId}</div>
            {this.state.dataSource.map((data) => {
              return (
                <Row channel="data-row" key={data} id={data}>
                  data
                </Row>
              )
            })}
          </>
        )
      },
    },
  })

  render(<DataTable groupId={1}></DataTable>)
  fireEvent.click(screen.getByRole('0'))
  await waitFor(() => {
    expect(screen.getByRole('selected_0')).toHaveTextContent('true')
    expect(screen.getByRole('currentSelectRowId')).toHaveTextContent('0')
  })
  fireEvent.click(screen.getByRole('4'))
  await waitFor(() => {
    expect(screen.getByRole('selected_4')).toHaveTextContent('true')
    expect(screen.getByRole('currentSelectRowId')).toHaveTextContent('4')
    expect(screen.getByRole('selected_0')).toHaveTextContent('false')
  })
})
