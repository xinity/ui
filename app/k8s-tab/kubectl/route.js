import Ember from 'ember';
import C from 'ui/utils/constants';

export default Ember.Route.extend({
  k8s: Ember.inject.service(),

  model() {
    return this.get('store').findAll('container').then((containers) => {
      let inst = null;
      for ( let i = 0 ; i < containers.get('length') ; i++)
      {
        let container = containers.objectAt(i);
        if ( container.get('state') !== 'running' )
        {
          continue;
        }

        var labels = container.get('labels')||{};
        if ( labels[C.LABEL.K8S_KUBECTL]+'' === 'true' )
        {
          inst = container;
          break;
        }
      }

      if ( inst )
      {
        return Ember.Object.create({
          command: ['/bin/bash','-l','-c','echo "# Run kubectl commands inside here\n# e.g. kubectl get rc\n"; TERM=xterm-256color /bin/bash'],
          instance: inst,
        });
      }
      else
      {
        return Ember.RSVP.reject('Unable to find an active kubectld container');
      }
    });
  },
});
