const nodejsscanIntegration = {
    delimiters: ['[[', ']]'],
    props: ['instance_name', 'section', 'selected_integration', 'is_selected', 'integration_data'],
    emits: ['set_data', 'clear_data'],
    data() {
        return this.initialState()
    },
    computed: {
        body_data() {
            const {
                config,
                is_default,
                selected_integration: id,
                save_intermediates_to,
                excludes,
            } = this
            return {
                config,
                is_default,
                id,
                save_intermediates_to,
                excludes,
            }
        },
    },
    watch: {
        selected_integration(newState, oldState) {
            console.debug('watching selected_integration: ', oldState, '->', newState, this.integration_data)
            this.set_data(this.integration_data?.settings, false)
        }
    },
    methods: {
        get_data() {
            if (this.is_selected) {
                return this.body_data
            }
        },
        set_data(data, emit = true) {
            Object.assign(this.$data, data)
            emit&& this.$emit('set_data', data)
        },
        clear_data() {
            Object.assign(this.$data, this.initialState())
            this.$emit('clear_data')
        },

        handleError(response) {
            try {
                response.json().then(
                    errorData => {
                        errorData.forEach(item => {
                            console.debug('nodejsscan item error', item)
                            this.error = {[item.loc[0]]: item.msg}
                        })
                    }
                )
            } catch (e) {
                console.log(e)
                alertCreateTest.add(e, 'danger-overlay')
            }
        },

        initialState: () => ({
            // toggle: false,
            error: {},
            config: {},
            save_intermediates_to: '/data/intermediates/sast',
            excludes: "",
        })
    },
    template: `
        <div class="mt-3">
            <div class="row">
                <div class="col">
                    <h7>Advanced Settings</h7>
                    <p>
                        <h13>Integration default settings can be overridden here</h13>
                    </p>
                </div>
            </div>
            <div class="form-group">
                <form autocomplete="off">
                    <h9>Excludes</h9>
                    <p>
                        <h13>(Optional) Excluded path files</h13>
                    </p>
                    <input type="text" class="form-control form-control-alternative"
                        placeholder=""
                        v-model="excludes"
                        :class="{ 'is-invalid': error.excludes }">
                    <div class="invalid-feedback">[[ error.excludes ]]</div>

                    <h9>Save intermediates to</h9>
                    <p>
                        <h13>Optional</h13>
                    </p>
                    <input type="text" class="form-control form-control-alternative"
                        placeholder=""
                        v-model="save_intermediates_to"
                        :class="{ 'is-invalid': error.save_intermediates_to }">
                    <div class="invalid-feedback">[[ error.save_intermediates_to ]]</div>
                </form>
            </div>
        </div>
    `
}


register_component('scanner-nodejsscan', nodejsscanIntegration)

