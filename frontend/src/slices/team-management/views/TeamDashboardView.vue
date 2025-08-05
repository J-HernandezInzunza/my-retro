<template>
  <div class="team-dashboard">
    <div class="q-pa-md">
      <!-- Team Header -->
      <div class="row items-center q-mb-lg">
        <div class="col">
          <h4 class="q-my-none">'Team Dashboard'</h4>
          <p class="text-grey-6 q-mb-none">
            Welcome to your team workspace
          </p>
        </div>
        <div class="col-auto">
          <q-btn 
            color="primary" 
            icon="add" 
            label="New Retro" 
            @click="createRetro"
            data-cy="new-retro-button"
          />
        </div>
      </div>

      <!-- Team Info Cards -->
      <div class="row q-gutter-md q-mb-lg">
        <!-- Team Members Card -->
        <div class="col-12 col-md-6">
          <q-card>
            <q-card-section>
              <div class="text-h6 q-mb-sm">Team Members</div>
              <div class="text-body2 text-grey-6">
                0
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <q-btn 
                flat 
                color="primary" 
                label="View Members" 
                @click="viewMembers"
                data-cy="view-members-button"
              />
            </q-card-section>
          </q-card>
        </div>

        <!-- Active Retros Card -->
        <div class="col-12 col-md-6">
          <q-card>
            <q-card-section>
              <div class="text-h6 q-mb-sm">Active Retros</div>
              <div class="text-body2 text-grey-6">
                0 active sessions
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <q-btn 
                flat 
                color="primary" 
                label="View All" 
                @click="viewRetros"
                data-cy="view-retros-button"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="q-mb-lg">
        <h5 class="q-my-md">Recent Activity</h5>
        <q-card>
          <q-card-section>
            <div class="text-center text-grey-6 q-py-lg">
              <q-icon name="history" size="3em" class="q-mb-md" />
              <div>No recent activity</div>
              <div class="text-caption">
                Start your first retrospective to see activity here
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Quick Actions -->
      <div>
        <h5 class="q-my-md">Quick Actions</h5>
        <div class="row q-gutter-md">
          <q-btn 
            color="primary" 
            icon="add_circle" 
            label="Start Retrospective"
            @click="createRetro"
            data-cy="start-retro-button"
          />
          <q-btn 
            color="secondary" 
            icon="people" 
            label="Invite Members"
            @click="inviteMembers"
            data-cy="invite-members-button"
          />
          <q-btn 
            flat 
            color="grey-7" 
            icon="settings" 
            label="Team Settings"
            @click="teamSettings"
            data-cy="team-settings-button"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'TeamDashboardView'
});

// Action handlers
const createRetro = () => {
  // TODO: Navigate to retro creation
  console.log('Create retro clicked');
};

const viewMembers = () => {
  // TODO: Navigate to team members view
  console.log('View members clicked');
};

const viewRetros = () => {
  // TODO: Navigate to retros list
  console.log('View retros clicked');
};

const inviteMembers = () => {
  // TODO: Open invite members dialog
  console.log('Invite members clicked');
};

const teamSettings = () => {
  // TODO: Navigate to team settings
  console.log('Team settings clicked');
};
</script>

<style scoped>
.team-dashboard {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
