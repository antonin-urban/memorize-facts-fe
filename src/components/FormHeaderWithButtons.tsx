import { Header, Button, Icon } from '@rneui/themed';
import { View, Text, StyleSheet } from 'react-native';
import { FONT_BIG, FONT_MEDIUM } from '../styleConstants';

interface FormHeaderWithButtonsProps {
  title: string;
  onCancel: (...props) => unknown;
  onDelete?: (...props) => unknown;
}

function FormHeaderWithButtons({
  title,
  onCancel,
  onDelete = undefined,
}: FormHeaderWithButtonsProps): React.ReactElement {
  const header = (
    <View style={styles.headerContainer}>
      <Header
        rightComponent={
          onDelete ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <Button size="sm" color="error" type="solid" onPress={onDelete as any}>
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <Icon name="delete-outline" color="white" adjustsFontSizeToFit={true} size={FONT_MEDIUM} />
              }
            </Button>
          ) : (
            {}
          )
        }
        centerComponent={
          <Text adjustsFontSizeToFit={true} style={styles.header}>
            {title}
          </Text>
        }
        leftComponent={
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <Button size="sm" type="solid" onPress={onCancel as any}>
            <Icon name="arrow-back-ios" color="white" adjustsFontSizeToFit={true} size={FONT_MEDIUM} />
          </Button>
        }
      />
    </View>
  );

  return header;
}

const styles = StyleSheet.create({
  header: {
    fontSize: FONT_BIG,
    fontWeight: 'bold',
    justifyContent: 'flex-start',
    alignItems: 'center',
    color: 'white',
  },

  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FormHeaderWithButtons;
