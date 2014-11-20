BCTAppServices.service('scrollingAlertsService', [ '$timeout', 'all_alerts',
'scrolling_animation_constants', 'generalServiceUtilities',

function($timeout, all_alerts, scrolling_animation_constants,
generalServiceUtilities) {

    var alert_message_indices = { global: 0 };

    function cycleThroughAlertFrames(old_index) {

        var new_index = old_index;

        if (old_index > number_of_steps - 1) {

            new_index = 0;

        }

        else if (old_index < 0) {

            new_index = number_of_steps - 1;

        }

        return new_index;

    }

    function cycleThroughAlertMessages(module, old_index) {

        var new_index = old_index;

        var number_of_messages = all_alerts[module].length;

        if (old_index > number_of_messages) {

            new_index = 1;

        }

        else if (old_index > number_of_messages - 1) {

            new_index = 0;

        }

        else if (old_index === -3) {

            new_index = number_of_messages - 3;

        }

        else if (old_index === -2) {

            new_index = number_of_messages - 2;

        }

        else if (old_index === -1) {

            new_index = number_of_messages - 1;

        }

        return new_index;

    }

    function changeAlertMessage(module, direction) {

        var message_iterator_amount = 1;

        if (direction === "prev") {

            message_iterator_amount *= -1;

        }

        var previous_message_index = alert_message_indices[module];

        alert_message_indices[module] += message_iterator_amount;

        alert_message_indices[module] =
        cycleThroughAlertMessages(module, alert_message_indices[module]);

        var current_message_index = alert_message_indices[module];

        if (previous_message_index !== current_message_index) {

            var new_alert_message = all_alerts[module][current_message_index];

            generalServiceUtilities.top_level_scope_prop_refs.
            changeScrollingAlertMessage(module, new_alert_message);

        }

    }

    var prev_stylings = { global: "" };

    var keyframes = scrolling_animation_constants.keyframes;

    var keyframe_setups = scrolling_animation_constants.keyframe_setups;

    function applyMessageStyle(module, style_name, new_style_setting) {

        var module_alert_el;

        if (module === "global") {

            module_alert_el = myride.dom_q.scrolling_alerts.global;

        }

        if (new_style_setting === true) {

            module_alert_el.classList.add(style_name);

        }

        else if (new_style_setting === false) {

            module_alert_el.classList.remove(style_name);

        }

    }

    function setKeyframeStyle(
        module,
        keyframe_setup,
        direction
    ) {

        var cur_keyframe_setup = keyframe_setups[keyframe_setup];

        for (var setting in cur_keyframe_setup) {

            var new_style_setting = cur_keyframe_setup[setting];

            var style_name = keyframes[setting];

            applyMessageStyle("global", style_name, new_style_setting);

        }

        if (prev_stylings[module] === "hidden_on_left" &&
            keyframe_setup === "hidden_on_right_no_transition") {

            changeAlertMessage(module, direction);

        }

        else if (prev_stylings[module] === "hidden_on_right" &&
            keyframe_setup === "hidden_on_left_no_transition") {

            changeAlertMessage(module, direction);

        }

        prev_stylings[module] = keyframe_setup;

    }

    function ScrollingMessage(module) {

        var self = this;

        this.module = module;

        this.step_forward = 0;
        this.step_reverse = 1;

        this.message_index = 0;

        this.goToNextStep = function() {

            setKeyframeStyle(
                self.module,
                steps_list_forward[self.step_forward].keyframe_setup,
                "next"
            );

            self.step_forward++;

            self.step_forward = cycleThroughAlertFrames(self.step_forward);

        };

        this.goToPrevStep = function() {

            setKeyframeStyle(
                self.module,
                steps_list_reverse[self.step_reverse].keyframe_setup,
                "prev"
            );

            self.step_reverse++;

            self.step_reverse = cycleThroughAlertFrames(self.step_reverse);

        };

    }

    var global_leader_message = new ScrollingMessage("global");

    var MESSAGE_DISPLAY_TIME =
    scrolling_animation_constants.message_display_time;

    var MESSAGE_TRANSITION_OUT_TIME =
    scrolling_animation_constants.message_transition_out_time;

    //General case: the minimum in an array of animation times
    var shortest_animation_time = MESSAGE_TRANSITION_OUT_TIME;

    var animation_configs = scrolling_animation_constants.animation_configs;

    for (var i=0;i<animation_configs.length;i++) {

        for (var j=0;j<animation_configs[i].length;j++) {

            var number_of_frames =
            animation_configs[i][j].duration / shortest_animation_time;

            animation_configs[i][j].number_of_frames = number_of_frames;

        }

    }

    //General case: the sum of all animation steps
    var number_of_steps =
    ((MESSAGE_TRANSITION_OUT_TIME * 2) + MESSAGE_DISPLAY_TIME) /
    shortest_animation_time;

    var steps_list_forward = new Array(number_of_steps);
    var steps_list_reverse = new Array(number_of_steps);

    var steps_counter_forward = 0;
    var steps_counter_reverse = 0;

    var steps_list;
    var steps_counter;

    for (var k=0;k<animation_configs.length;k++) {

        //k === 0, i.e., the forward direction for the scrolling animation
        if (k === 0) {

            steps_list = steps_list_forward;
            steps_counter = steps_counter_forward;

        }

        //k === 1, i.e., the reverse direction for the scrolling animation
        else if (k === 1) {

            steps_list = steps_list_reverse;
            steps_counter = steps_counter_reverse;

        }

        for (var l=0;l<animation_configs[k].length;l++) {

            var cur_length = animation_configs[k][l].number_of_frames;

            for (var m=0;m<cur_length;m++) {

                var cur_step = {

                    keyframe_setup: animation_configs[k][l].keyframe_setup_name

                };

                steps_list[steps_counter] = cur_step;

                steps_counter++;

            }

        }

    }

    var forward_message_timer;
    var reverse_message_timer;

    function runMessageForwardScrollingAnimations() {

        forward_message_timer = $timeout(function() {

            global_leader_message.goToNextStep();

            runMessageForwardScrollingAnimations();

        }, shortest_animation_time);

    }

    function runMessageReverseScrollingAnimations() {

        reverse_message_timer = $timeout(function() {

            global_leader_message.goToPrevStep();

            runMessageReverseScrollingAnimations();

        }, shortest_animation_time);

    }

    function getStepLastDisplayIndex(steps_list) {

        var step_last_display_index;

        for (var step_index in steps_list) {

            var current_step = steps_list_forward[step_index].keyframe_setup;

            if (current_step === "hidden_on_right_no_transition" ||
                current_step === "hidden_on_left_no_transition") {

                step_last_display_index = step_index;

                return step_last_display_index;

            }

        }

    }

    var forward_step_last_display_index =
    getStepLastDisplayIndex(steps_list_forward);

    var reverse_step_last_display_index =
    getStepLastDisplayIndex(steps_list_reverse);

    function getTransitionStepLabels(steps_list) {

        var transition_steps =
        steps_list.filter(function(step) {

            if (step.keyframe_setup !== "displayed_in_middle") {

                return step;

            }

        });

        return transition_steps;

    }

    var forward_transition_steps =
    getTransitionStepLabels(steps_list_forward);

    var reverse_transition_steps =
    getTransitionStepLabels(steps_list_reverse);

    function getIndexObjectsArray(obj_array, targ_object, targ_property) {

        var targ_prop_val = targ_object[targ_property];

        for (var i=0;i<obj_array.length;i++) {

            var cur_prop_val = obj_array[i][targ_property];

            if (cur_prop_val === targ_prop_val) {

                return i;

            }

        }

        return -1;

    }

    function getTransitionStepIndices(full_step_list, transition_steps) {

        var transition_steps_indices = [];

        for (var t_s_idx=0;t_s_idx<transition_steps.length;t_s_idx++) {

            var transition_step_index =
            getIndexObjectsArray(
                full_step_list,
                transition_steps[t_s_idx],
                "keyframe_setup"
            );

            transition_steps_indices.push(transition_step_index);

        }

        return transition_steps_indices;

    }

    var forward_transition_steps_indices =
    getTransitionStepIndices(steps_list_forward, forward_transition_steps);

    var reverse_transition_steps_indices =
    getTransitionStepIndices(steps_list_reverse, reverse_transition_steps);

    var previous_global_alert_direction;
    var current_global_alert_direction;

    this.goToNextGlobalAlertMessage = function() {

        current_global_alert_direction = "forward";

        if (current_global_alert_direction ===
            previous_global_alert_direction &&
            forward_transition_steps_indices.
            indexOf(global_leader_message.step_forward) !== -1) {

            return true;

        }

        if (current_global_alert_direction !==
            previous_global_alert_direction) {

            $timeout.cancel(reverse_message_timer);

            runMessageForwardScrollingAnimations();

            global_leader_message.reverse_step = 0;

            generalServiceUtilities.top_level_scope_prop_refs.
            changeGlobalAlertsBarHighlighting("right");

        }

        var frames_to_skip =
        forward_step_last_display_index -
        global_leader_message.step_forward;

        for (var i=0;i<frames_to_skip;i++) {

            global_leader_message.goToNextStep();

        }

        previous_global_alert_direction = "forward";

    };

    this.goToPrevGlobalAlertMessage = function() {

        current_global_alert_direction = "reverse";

        if (current_global_alert_direction ===
            previous_global_alert_direction &&
            reverse_transition_steps_indices.
            indexOf(global_leader_message.step_reverse) !== -1) {

            return true;

        }

        if (current_global_alert_direction !==
            previous_global_alert_direction) {

            $timeout.cancel(forward_message_timer);

            runMessageReverseScrollingAnimations();

            global_leader_message.forward_step = 0;

            generalServiceUtilities.top_level_scope_prop_refs.
            changeGlobalAlertsBarHighlighting("right");

        }

        var frames_to_skip =
        reverse_step_last_display_index -
        global_leader_message.step_reverse;

        for (var i=0;i<frames_to_skip;i++) {

            global_leader_message.goToPrevStep();

        }

        previous_global_alert_direction = "reverse";

    };

}]);